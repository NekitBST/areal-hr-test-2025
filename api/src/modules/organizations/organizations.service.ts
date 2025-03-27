import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, name, comment, created_at, updated_at FROM organizations ORDER BY id'
    );
    return result.rows;
  }
}
