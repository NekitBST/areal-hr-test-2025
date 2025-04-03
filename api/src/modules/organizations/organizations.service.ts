import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, name, comment, created_at, updated_at, deleted, deleted_at FROM organizations ORDER BY id'
    );

    return result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, comment, created_at, updated_at, deleted, deleted_at FROM organizations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }

    const { deleted, deleted_at, ...row } = result.rows[0];
    return deleted ? { ...row, deleted_at } : row;
  }

  async create(createOrganizationDto: CreateOrganizationDto) {
    const { name, comment } = createOrganizationDto;
    const result = await this.dbService.query(
      'INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING id, name, comment, created_at, updated_at',
      [name, comment]
    );
    return result.rows[0];
  }

  async softDelete(id: number) {
    const checkResult = await this.dbService.query(
      'SELECT deleted FROM organizations WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted) {
      throw new BadRequestException(`Организация с ID ${id} уже удалена`);
    }

    const result = await this.dbService.query(
      'UPDATE organizations SET deleted = true, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    return result.rows[0];
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const checkResult = await this.dbService.query(
      'SELECT deleted FROM organizations WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted) {
      throw new BadRequestException(`Невозможно обновить удаленную организацию с ID ${id}`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    if (updateOrganizationDto.name !== undefined) {
      updateFields.push(`name = $${valueIndex}`);
      values.push(updateOrganizationDto.name);
      valueIndex++;
    }

    if (updateOrganizationDto.comment !== undefined) {
      updateFields.push(`comment = $${valueIndex}`);
      values.push(updateOrganizationDto.comment);
      valueIndex++;
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await this.dbService.query(
      `UPDATE organizations SET ${updateFields.join(', ')} WHERE id = $${valueIndex} RETURNING id, name, comment, created_at, updated_at`,
      values
    );

    return result.rows[0];
  }
}
