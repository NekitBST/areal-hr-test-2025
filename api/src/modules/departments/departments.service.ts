import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, name, parent_id, organization_id, comment, created_at, updated_at, deleted, deleted_at FROM departments ORDER BY id'
    );

    return result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, parent_id, organization_id, comment, created_at, updated_at, deleted, deleted_at FROM departments WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Отдел с ID ${id} не найден`);
    }

    const { deleted, deleted_at, ...row } = result.rows[0];
    return deleted ? { ...row, deleted_at } : row;
  }

  async findByOrganization(organizationId: number) {
    const result = await this.dbService.query(
      'SELECT id, name, parent_id, organization_id, comment, created_at, updated_at, deleted, deleted_at FROM departments WHERE organization_id = $1 ORDER BY id',
      [organizationId]
    );

    return result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );
  }
}
