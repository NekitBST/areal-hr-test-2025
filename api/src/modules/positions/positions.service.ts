import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreatePositionDto } from './dto/create-position.dto';

@Injectable()
export class PositionsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, name, created_at, deleted, deleted_at FROM positions ORDER BY id'
    );

    return result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, created_at, deleted, deleted_at FROM positions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Должность с ID ${id} не найдена`);
    }

    const { deleted, deleted_at, ...row } = result.rows[0];
    return deleted ? { ...row, deleted_at } : row;
  }

  async create(createPositionDto: CreatePositionDto) {
    const { name } = createPositionDto;
    const result = await this.dbService.query(
      'INSERT INTO positions (name) VALUES ($1) RETURNING id, name, created_at',
      [name]
    );
    return result.rows[0];
  }

  async softDelete(id: number) {
    const checkResult = await this.dbService.query(
      'SELECT deleted FROM positions WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Должность с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted) {
      throw new BadRequestException(`Должность с ID ${id} уже удалена`);
    }

    const result = await this.dbService.query(
      'UPDATE positions SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    return result.rows[0];
  }
}
