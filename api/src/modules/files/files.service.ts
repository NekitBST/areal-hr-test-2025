import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FindAllFilesDto } from './dto/find-all-files.dto';
import { buildUpdateQuery } from '../../utils/db-update.utils';
import { LogChanges } from '../../decorators/log-changes.decorator';
import { PoolClient } from 'pg';
import { Request } from 'express';

@Injectable()
export class FilesService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(query: FindAllFilesDto = {}) {
    const sortField = query.sortField || 'id';
    const sortOrder = query.sortOrder || 'ASC';

    const result = await this.dbService.query(
      'SELECT id, name, file_path, employee_id, created_at, updated_at ' +
      'FROM files WHERE deleted_at IS NULL ' +
      `ORDER BY ${sortField} ${sortOrder}`
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, file_path, employee_id, created_at, updated_at ' +
      'FROM files WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }

    return result.rows[0];
  }

  @LogChanges('file')
  async create(request: Request, createFileDto: CreateFileDto, client?: PoolClient) {
    const employeeExists = await (client || this.dbService).query(
      'SELECT id FROM employees WHERE id = $1 AND deleted_at IS NULL',
      [createFileDto.employee_id]
    );

    if (employeeExists.rows.length === 0) {
      throw new BadRequestException(`Сотрудник с ID ${createFileDto.employee_id} не найден или удален`);
    }

    const { name, file_path, employee_id } = createFileDto;
    const result = await (client || this.dbService).query(
      'INSERT INTO files (name, file_path, employee_id) ' +
      'VALUES ($1, $2, $3) ' +
      'RETURNING id, name, file_path, employee_id, created_at, updated_at',
      [name, file_path, employee_id]
    );

    return result.rows[0];
  }

  @LogChanges('file')
  async update(request: Request, id: number, updateFileDto: UpdateFileDto, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM files WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Невозможно обновить удаленный файл с ID ${id}`);
    }

    if (updateFileDto.employee_id) {
      const employeeExists = await (client || this.dbService).query(
        'SELECT id FROM employees WHERE id = $1 AND deleted_at IS NULL',
        [updateFileDto.employee_id]
      );

      if (employeeExists.rows.length === 0) {
        throw new BadRequestException(`Сотрудник с ID ${updateFileDto.employee_id} не найден или удален`);
      }
    }

    const { updateFields, values, valueIndex } = buildUpdateQuery(updateFileDto);

    if (updateFields.length === 0) {
      return this.findOne(id);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await (client || this.dbService).query(
      `UPDATE files SET ${updateFields.join(', ')} ` +
      `WHERE id = $${valueIndex} AND deleted_at IS NULL ` +
      'RETURNING id, name, file_path, employee_id, created_at, updated_at',
      values
    );

    return result.rows[0];
  }

  @LogChanges('file')
  async softDelete(request: Request, id: number, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM files WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Файл с ID ${id} уже удален`);
    }

    const result = await (client || this.dbService).query(
      'UPDATE files SET deleted_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $1 AND deleted_at IS NULL ' +
      'RETURNING id, name, file_path, employee_id, created_at, updated_at, deleted_at',
      [id]
    );

    return result.rows[0];
  }
} 