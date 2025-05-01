import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { FindAllChangeHistoryDto } from './dto/find-all-change-history.dto';

@Injectable()
export class ChangeHistoryService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(params: FindAllChangeHistoryDto = {}) {
    const sortField = params.sortField || 'id';
    const sortOrder = params.sortOrder || 'ASC';

    const result = await this.dbService.query(
      `SELECT ch.*, u.last_name, u.first_name 
      FROM change_history ch
      LEFT JOIN users u ON ch.changed_by = u.id
      ORDER BY ch.${sortField} ${sortOrder}`
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      `SELECT ch.*, u.last_name, u.first_name 
      FROM change_history ch
      LEFT JOIN users u ON ch.changed_by = u.id
      WHERE ch.id = $1`,
      [id]
    );
    return result.rows[0];
  }
} 