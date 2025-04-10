import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { buildUpdateQuery } from '../../utils/db-update.utils';

@Injectable()
export class PositionsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, name, created_at, updated_at FROM positions WHERE deleted_at IS NULL ORDER BY id'
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, created_at, updated_at FROM positions WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Должность с ID ${id} не найдена`);
    }

    return result.rows[0];
  }

  async create(createPositionDto: CreatePositionDto) {
    const { name } = createPositionDto;
    const result = await this.dbService.query(
      'INSERT INTO positions (name) VALUES ($1) RETURNING id, name, created_at, updated_at',
      [name]
    );
    return result.rows[0];
  }

  async softDelete(id: number) {
    const checkResult = await this.dbService.query(
      'SELECT deleted_at FROM positions WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Должность с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Должность с ID ${id} уже удалена`);
    }

    const result = await this.dbService.query(
      'UPDATE positions SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, name, created_at, updated_at, deleted_at',
      [id]
    );

    return result.rows[0];
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const checkResult = await this.dbService.query(
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

    const result = await this.dbService.query(
      `UPDATE positions SET ${updateFields.join(', ')} WHERE id = $${valueIndex} AND deleted_at IS NULL RETURNING id, name, created_at, updated_at`,
      values
    );

    return result.rows[0];
  }
}
