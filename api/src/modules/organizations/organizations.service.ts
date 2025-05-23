import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { FindAllOrganizationsDto } from './dto/find-all-organizations.dto';
import { buildUpdateQuery } from '../../utils/db-update.utils';
import { LogChanges } from '../../decorators/log-changes.decorator';
import { PoolClient } from 'pg';
import { Request } from 'express';

@Injectable()
export class OrganizationsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(query: FindAllOrganizationsDto = {}) {
    const sortField = query.sortField || 'id';
    const sortOrder = query.sortOrder || 'ASC';

    const result = await this.dbService.query(
      'SELECT id, name, comment, created_at, updated_at ' +
      'FROM organizations WHERE deleted_at IS NULL ' +
      `ORDER BY ${sortField} ${sortOrder}`
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, comment, created_at, updated_at ' +
      'FROM organizations WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }

    return result.rows[0];
  }

  @LogChanges('organization')
  async create(request: Request, createOrganizationDto: CreateOrganizationDto, client?: PoolClient) {
    const { name, comment } = createOrganizationDto;
    const result = await (client || this.dbService).query(
      'INSERT INTO organizations (name, comment) ' +
      'VALUES ($1, $2) ' +
      'RETURNING id, name, comment, created_at, updated_at',
      [name, comment]
    );
    return result.rows[0];
  }

  @LogChanges('organization')
  async softDelete(request: Request, id: number, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM organizations WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Организация с ID ${id} уже удалена`);
    }

    const result = await (client || this.dbService).query(
      'UPDATE organizations SET deleted_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $1 AND deleted_at IS NULL ' +
      'RETURNING id, name, comment, created_at, updated_at, deleted_at',
      [id]
    );

    return result.rows[0];
  }

  @LogChanges('organization')
  async update(request: Request, id: number, updateOrganizationDto: UpdateOrganizationDto, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM organizations WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Невозможно обновить удаленную организацию с ID ${id}`);
    }

    const { updateFields, values, valueIndex } = buildUpdateQuery(updateOrganizationDto);

    if (updateFields.length === 0) {
      return this.findOne(id);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await (client || this.dbService).query(
      `UPDATE organizations SET ${updateFields.join(', ')} ` +
      `WHERE id = $${valueIndex} AND deleted_at IS NULL ` +
      'RETURNING id, name, comment, created_at, updated_at',
      values
    );

    return result.rows[0];
  }
}
