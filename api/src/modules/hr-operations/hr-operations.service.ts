import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';
import { buildUpdateQuery } from '../../utils/db-update.utils';
import { LogChanges } from '../../decorators/log-changes.decorator';
import { PoolClient } from 'pg';

@Injectable()
export class HrOperationsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, employee_id, department_id, position_id, salary, action, ' +
      'action_date, created_at, updated_at ' +
      'FROM hr_operations ' +
      'WHERE deleted_at IS NULL ' +
      'ORDER BY id'
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, employee_id, department_id, position_id, salary, action, ' +
      'action_date, created_at, updated_at ' +
      'FROM hr_operations ' +
      'WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Кадровая операция с ID ${id} не найдена`);
    }

    return result.rows[0];
  }

  @LogChanges('hr_operation')
  async create(request: Request, createHrOperationDto: CreateHrOperationDto, client?: PoolClient) {
    const { employee_id, department_id, position_id, salary, action } = createHrOperationDto;
    
    const result = await (client || this.dbService).query(
      'INSERT INTO hr_operations (employee_id, department_id, position_id, salary, action) ' +
      'VALUES ($1, $2, $3, $4, $5) ' +
      'RETURNING id, employee_id, department_id, position_id, salary, action, action_date, created_at, updated_at',
      [employee_id, department_id, position_id, salary, action]
    );

    if (['Прием на работу', 'Перевод', 'Изменение зарплаты', 'Увольнение'].includes(action)) {
      await (client || this.dbService).query(
        'UPDATE employees SET updated_at = CURRENT_TIMESTAMP ' +
        'WHERE id = $1',
        [employee_id]
      );
    }
    
    return result.rows[0];
  }

  @LogChanges('hr_operation')
  async update(request: Request, id: number, updateHrOperationDto: UpdateHrOperationDto, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
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

    const result = await (client || this.dbService).query(
      `UPDATE hr_operations SET ${updateFields.join(', ')} ` +
      `WHERE id = $${valueIndex} AND deleted_at IS NULL ` +
      'RETURNING id, employee_id, department_id, position_id, salary, action, action_date, created_at, updated_at',
      values
    );

    return result.rows[0];
  }

  @LogChanges('hr_operation')
  async softDelete(request: Request, id: number, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM hr_operations WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Кадровая операция с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Кадровая операция с ID ${id} уже удалена`);
    }

    const result = await (client || this.dbService).query(
      'UPDATE hr_operations SET deleted_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $1 AND deleted_at IS NULL ' +
      'RETURNING id, employee_id, department_id, position_id, salary, action, action_date, created_at, updated_at, deleted_at',
      [id]
    );

    return result.rows[0];
  }
} 