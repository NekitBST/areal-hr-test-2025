import { Injectable } from '@nestjs/common';
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
}
