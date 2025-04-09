import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, name, organization_id, parent_id, comment, created_at, updated_at FROM departments WHERE deleted_at IS NULL ORDER BY id'
    );

    return result.rows;
  }

  async findAllTree() {
    const result = await this.dbService.query(
      'SELECT id, name, parent_id, organization_id, comment, created_at, updated_at, deleted, deleted_at FROM departments ORDER BY id'
    );

    const departments = result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );

    return this.buildDepartmentTree(departments);
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, organization_id, parent_id, comment, created_at, updated_at FROM departments WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Отдел с ID ${id} не найден`);
    }

    return result.rows[0];
  }

  async findOneWithTree(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, parent_id, organization_id, comment, created_at, updated_at, deleted, deleted_at FROM departments WHERE id = $1 OR parent_id = $1 ORDER BY id',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Отдел с ID ${id} не найден`);
    }

    const departments = result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );

    return this.buildDepartmentTree(departments)[0];
  }

  async findByOrganization(organizationId: number) {
    const result = await this.dbService.query(
      'SELECT id, name, parent_id, organization_id, comment, created_at, updated_at, deleted, deleted_at FROM departments WHERE organization_id = $1 ORDER BY id',
      [organizationId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Организация с ID ${organizationId} не найдена`);
    }

    const departments = result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );

    return this.buildDepartmentTree(departments);
  }

  async create(createDepartmentDto: CreateDepartmentDto) {
    const { name, organization_id, parent_id, comment } = createDepartmentDto;

    const result = await this.dbService.query(
      'INSERT INTO departments (name, organization_id, parent_id, comment) VALUES ($1, $2, $3, $4) RETURNING id, name, organization_id, parent_id, comment, created_at, updated_at',
      [name, organization_id, parent_id || null, comment || null]
    );

    return result.rows[0];
  }

  async softDelete(id: number) {
    const checkResult = await this.dbService.query(
      'SELECT deleted_at FROM departments WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Отдел с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Отдел с ID ${id} уже удален`);
    }

    const result = await this.dbService.query(
      'UPDATE departments SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, name, organization_id, parent_id, comment, created_at, updated_at, deleted_at',
      [id]
    );

    return result.rows[0];
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const checkResult = await this.dbService.query(
      'SELECT deleted_at FROM departments WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Отдел с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Невозможно обновить удаленный отдел с ID ${id}`);
    }

    const { name, parent_id, organization_id, comment } = updateDepartmentDto;
    const updateFields: string[] = [];
    const values: (string | number | null)[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (parent_id !== undefined) {
      updateFields.push(`parent_id = $${paramCount}`);
      values.push(parent_id);
      paramCount++;
    }

    if (organization_id !== undefined) {
      updateFields.push(`organization_id = $${paramCount}`);
      values.push(organization_id);
      paramCount++;
    }

    if (comment !== undefined) {
      updateFields.push(`comment = $${paramCount}`);
      values.push(comment);
      paramCount++;
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await this.dbService.query(
      `UPDATE departments SET ${updateFields.join(', ')} WHERE id = $${paramCount} AND deleted_at IS NULL RETURNING id, name, organization_id, parent_id, comment, created_at, updated_at`,
      values
    );

    return result.rows[0];
  }

  private buildDepartmentTree(departments: any[], parentId: number | null = null): any[] {
    return departments
      .filter(dept => dept.parent_id === parentId)
      .map(dept => ({
        ...dept,
        children: this.buildDepartmentTree(departments, dept.id)
      }));
  }
}
