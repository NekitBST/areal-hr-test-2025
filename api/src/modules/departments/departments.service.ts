import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { FindAllDepartmentsDto } from './dto/find-all-departments.dto';
import { buildUpdateQuery } from '../../utils/db-update.utils';
import { LogChanges } from '../../decorators/log-changes.decorator';
import { PoolClient } from 'pg';
import { Request } from 'express';

@Injectable()
export class DepartmentsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(query: FindAllDepartmentsDto = {}) {
    const sortField = query.sortField || 'id';
    const sortOrder = query.sortOrder || 'ASC';

    const result = await this.dbService.query(
      'SELECT id, name, organization_id, parent_id, comment, created_at, updated_at ' +
      'FROM departments WHERE deleted_at IS NULL ' +
      `ORDER BY ${sortField} ${sortOrder}`
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, organization_id, parent_id, comment, created_at, updated_at ' +
      'FROM departments WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Отдел с ID ${id} не найден`);
    }

    return result.rows[0];
  }

  @LogChanges('department')
  async create(request: Request, createDepartmentDto: CreateDepartmentDto, client?: PoolClient) {
    const { name, organization_id, parent_id, comment } = createDepartmentDto;

    const result = await (client || this.dbService).query(
      'INSERT INTO departments (name, organization_id, parent_id, comment) ' +
      'VALUES ($1, $2, $3, $4) ' +
      'RETURNING id, name, organization_id, parent_id, comment, created_at, updated_at',
      [name, organization_id, parent_id || null, comment || null]
    );

    return result.rows[0];
  }

  @LogChanges('department')
  async update(request: Request, id: number, updateDepartmentDto: UpdateDepartmentDto, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM departments WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Отдел с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Невозможно обновить удаленный отдел с ID ${id}`);
    }

    const { updateFields, values, valueIndex } = buildUpdateQuery(updateDepartmentDto);

    if (updateFields.length === 0) {
      return this.findOne(id);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await (client || this.dbService).query(
      `UPDATE departments SET ${updateFields.join(', ')} ` +
      `WHERE id = $${valueIndex} AND deleted_at IS NULL ` +
      'RETURNING id, name, organization_id, parent_id, comment, created_at, updated_at',
      values
    );

    return result.rows[0];
  }

  @LogChanges('department')
  async softDelete(request: Request, id: number, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM departments WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Отдел с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Отдел с ID ${id} уже удален`);
    }

    const result = await (client || this.dbService).query(
      'UPDATE departments SET deleted_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $1 AND deleted_at IS NULL ' +
      'RETURNING id, name, organization_id, parent_id, comment, created_at, updated_at, deleted_at',
      [id]
    );

    return result.rows[0];
  }
}
