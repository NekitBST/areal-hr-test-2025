import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { FindAllPositionsDto } from './dto/find-all-positions.dto';
import { buildUpdateQuery } from '../../utils/db-update.utils';
import { LogChanges } from '../../decorators/log-changes.decorator';
import { PoolClient } from 'pg';
import { Request } from 'express';

@Injectable()
export class PositionsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(query: FindAllPositionsDto = {}) {
    const sortField = query.sortField || 'id';
    const sortOrder = query.sortOrder || 'ASC';

    const result = await this.dbService.query(
      'SELECT id, name, created_at, updated_at ' +
      'FROM positions WHERE deleted_at IS NULL ' +
      `ORDER BY ${sortField} ${sortOrder}`
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, created_at, updated_at ' +
      'FROM positions WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Должность с ID ${id} не найдена`);
    }

    return result.rows[0];
  }

  @LogChanges('position')
  async create(request: Request, createPositionDto: CreatePositionDto, client?: PoolClient) {
    const { name } = createPositionDto;
    const result = await (client || this.dbService).query(
      'INSERT INTO positions (name) ' +
      'VALUES ($1) ' +
      'RETURNING id, name, created_at, updated_at',
      [name]
    );
    return result.rows[0];
  }

  @LogChanges('position')
  async softDelete(request: Request, id: number, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM positions WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Должность с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Должность с ID ${id} уже удалена`);
    }

    const result = await (client || this.dbService).query(
      'UPDATE positions SET deleted_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $1 AND deleted_at IS NULL ' +
      'RETURNING id, name, created_at, updated_at, deleted_at',
      [id]
    );

    return result.rows[0];
  }

  @LogChanges('position')
  async update(request: Request, id: number, updatePositionDto: UpdatePositionDto, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM positions WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Должность с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Невозможно обновить удаленную должность с ID ${id}`);
    }

    const { updateFields, values, valueIndex } = buildUpdateQuery(updatePositionDto);

    if (updateFields.length === 0) {
      return this.findOne(id);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await (client || this.dbService).query(
      `UPDATE positions SET ${updateFields.join(', ')} ` +
      `WHERE id = $${valueIndex} AND deleted_at IS NULL ` +
      'RETURNING id, name, created_at, updated_at',
      values
    );

    return result.rows[0];
  }
}
