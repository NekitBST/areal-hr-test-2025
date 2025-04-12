import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';

@Injectable()
export class ChangeHistoryService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      `SELECT ch.*, u.last_name, u.first_name 
      FROM change_history ch
      LEFT JOIN users u ON ch.changed_by = u.id
      ORDER BY id`
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