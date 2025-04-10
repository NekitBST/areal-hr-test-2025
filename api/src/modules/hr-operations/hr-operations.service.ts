import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';
import { buildUpdateQuery } from '../../utils/db-update.utils';

@Injectable()
export class HrOperationsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, employee_id, department_id, position_id, salary, action, action_date, created_at, updated_at ' +
      'FROM hr_operations WHERE deleted_at IS NULL ORDER BY id'
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, employee_id, department_id, position_id, salary, action, action_date, created_at, updated_at ' +
      'FROM hr_operations WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Кадровая операция с ID ${id} не найдена`);
    }

    return result.rows[0];
  }

  async create(createHrOperationDto: CreateHrOperationDto) {
    const { employee_id, department_id, position_id, salary, action } = createHrOperationDto;
    
    const result = await this.dbService.query(
      'INSERT INTO hr_operations (employee_id, department_id, position_id, salary, action) ' +
      'VALUES ($1, $2, $3, $4, $5) ' +
      'RETURNING id, employee_id, department_id, position_id, salary, action, action_date, created_at, updated_at',
      [employee_id, department_id, position_id, salary, action]
    );
    
    return result.rows[0];
  }

  async update(id: number, updateHrOperationDto: UpdateHrOperationDto) {
    const checkResult = await this.dbService.query(
      'SELECT deleted_at FROM hr_operations WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Кадровая операция с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Невозможно обновить удаленную кадровую операцию с ID ${id}`);
    }

    const { updateFields, values, valueIndex } = buildUpdateQuery(updateHrOperationDto);

    if (updateFields.length === 0) {
      return this.findOne(id);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await this.dbService.query(
      `UPDATE hr_operations SET ${updateFields.join(', ')} ` +
      `WHERE id = $${valueIndex} AND deleted_at IS NULL ` +
      'RETURNING id, employee_id, department_id, position_id, salary, action, action_date, created_at, updated_at',
      values
    );

    return result.rows[0];
  }

  async softDelete(id: number) {
    const checkResult = await this.dbService.query(
      'SELECT deleted_at FROM hr_operations WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Кадровая операция с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Кадровая операция с ID ${id} уже удалена`);
    }

    const result = await this.dbService.query(
      'UPDATE hr_operations SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $1 ' +
      'RETURNING id, employee_id, department_id, position_id, salary, action, action_date, created_at, updated_at, deleted_at',
      [id]
    );

    return result.rows[0];
  }
} 