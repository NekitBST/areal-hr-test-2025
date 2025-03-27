import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, name, comment, created_at, updated_at FROM organizations ORDER BY id'
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, comment, created_at, updated_at FROM organizations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }

    return result.rows[0];
  }

  async create(createOrganizationDto: CreateOrganizationDto) {
    const { name, comment } = createOrganizationDto;
    const result = await this.dbService.query(
      'INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING id, name, comment, created_at, updated_at',
      [name, comment]
    );
    return result.rows[0];
  }
}
