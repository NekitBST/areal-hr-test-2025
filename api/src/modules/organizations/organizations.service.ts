import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { buildUpdateQuery } from '../../utils/db-update.utils';
import { LogChanges } from '../../decorators/log-changes.decorator';

@Injectable()
export class OrganizationsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, name, comment, created_at, updated_at FROM organizations WHERE deleted_at IS NULL ORDER BY id'
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, comment, created_at, updated_at FROM organizations WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }

    return result.rows[0];
  }

  @LogChanges('organization')
  async create(createOrganizationDto: CreateOrganizationDto) {
    const { name, comment } = createOrganizationDto;
    const result = await this.dbService.query(
      'INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING id, name, comment, created_at, updated_at',
      [name, comment]
    );
    return result.rows[0];
  }

  @LogChanges('organization')
  async softDelete(id: number) {
    const checkResult = await this.dbService.query(
      'SELECT deleted_at FROM organizations WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Организация с ID ${id} уже удалена`);
    }

    const result = await this.dbService.query(
      'UPDATE organizations SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, name, comment, created_at, updated_at, deleted_at',
      [id]
    );

    return result.rows[0];
  }

  @LogChanges('organization')
  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const checkResult = await this.dbService.query(
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

    const result = await this.dbService.query(
      `UPDATE organizations SET ${updateFields.join(', ')} WHERE id = $${valueIndex} AND deleted_at IS NULL RETURNING id, name, comment, created_at, updated_at`,
      values
    );

    return result.rows[0];
  }
}
