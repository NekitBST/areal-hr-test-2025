import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, name, parent_id, organization_id, comment, created_at, updated_at, deleted, deleted_at FROM departments ORDER BY id'
    );

    return result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );
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
      'SELECT id, name, parent_id, organization_id, comment, created_at, updated_at, deleted, deleted_at FROM departments WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Отдел с ID ${id} не найден`);
    }

    const { deleted, deleted_at, ...row } = result.rows[0];
    return deleted ? { ...row, deleted_at } : row;
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

    const departments = result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );

    return this.buildDepartmentTree(departments);
  }

  async create(createDepartmentDto: CreateDepartmentDto) {
    const { name, parent_id, organization_id, comment } = createDepartmentDto;
    const result = await this.dbService.query(
      'INSERT INTO departments (name, parent_id, organization_id, comment) VALUES ($1, $2, $3, $4) RETURNING id, name, parent_id, organization_id, comment, created_at, updated_at',
      [name, parent_id || null, organization_id, comment || null]
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
