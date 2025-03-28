import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';

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
}
