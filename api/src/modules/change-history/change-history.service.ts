import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateChangeHistoryDto } from './dto/create-change-history.dto';

@Injectable()
export class ChangeHistoryService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      `SELECT ch.*, u.last_name, u.first_name, u.middle_name 
      FROM change_history ch
      LEFT JOIN users u ON ch.changed_by = u.id
      ORDER BY id`
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      `SELECT ch.*, u.last_name, u.first_name, u.middle_name 
      FROM change_history ch
      LEFT JOIN users u ON ch.changed_by = u.id
      WHERE ch.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async findByObjectType(objectType: string) {
    const result = await this.dbService.query(
      `SELECT ch.*, u.last_name, u.first_name, u.middle_name 
      FROM change_history ch
      LEFT JOIN users u ON ch.changed_by = u.id
      WHERE ch.object_type = $1
      ORDER BY ch.operation_time DESC`,
      [objectType]
    );
    return result.rows;
  }

  async findByObjectId(objectType: string, objectId: number) {
    const result = await this.dbService.query(
      `SELECT ch.*, u.last_name, u.first_name, u.middle_name 
      FROM change_history ch
      LEFT JOIN users u ON ch.changed_by = u.id
      WHERE ch.object_type = $1 AND ch.object_id = $2
      ORDER BY ch.operation_time DESC`,
      [objectType, objectId]
    );
    return result.rows;
  }

  async create(createChangeHistoryDto: CreateChangeHistoryDto) {
    const { changed_by, object_type, object_id, old_value, new_value } = createChangeHistoryDto;
    
    const result = await this.dbService.query(
      `INSERT INTO change_history 
        (changed_by, object_type, object_id, old_value, new_value) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [changed_by, object_type, object_id, old_value, new_value]
    );
    
    return result.rows[0];
  }
} 