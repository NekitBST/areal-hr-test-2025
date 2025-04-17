import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { buildUpdateQuery } from '../../utils/db-update.utils';
import { LogChanges } from '../../decorators/log-changes.decorator';
import { PoolClient } from 'pg';

@Injectable()
export class EmployeesService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, last_name, first_name, middle_name, date_of_birth, ' +
      'passport_series, passport_number, passport_issue_date, passport_department_code, ' +
      'passport_issued_by, registration_area, registration_city, registration_street, ' +
      'registration_house, registration_building, registration_apartment, created_at, updated_at ' +
      'FROM employees WHERE deleted_at IS NULL ORDER BY id'
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, last_name, first_name, middle_name, date_of_birth, ' +
      'passport_series, passport_number, passport_issue_date, passport_department_code, ' +
      'passport_issued_by, registration_area, registration_city, registration_street, ' +
      'registration_house, registration_building, registration_apartment, created_at, updated_at ' +
      'FROM employees WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }

    return result.rows[0];
  }

  @LogChanges('employee')
  async create(createEmployeeDto: CreateEmployeeDto, client?: PoolClient) {
    const {
      last_name, first_name, middle_name, date_of_birth,
      passport_series, passport_number, passport_issue_date,
      passport_department_code, passport_issued_by,
      registration_area, registration_city, registration_street,
      registration_house, registration_building, registration_apartment
    } = createEmployeeDto;

    const result = await (client || this.dbService).query(
      'INSERT INTO employees (last_name, first_name, middle_name, date_of_birth, ' +
      'passport_series, passport_number, passport_issue_date, passport_department_code, ' +
      'passport_issued_by, registration_area, registration_city, registration_street, ' +
      'registration_house, registration_building, registration_apartment) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ' +
      'RETURNING id, last_name, first_name, middle_name, date_of_birth, passport_series, ' +
      'passport_number, passport_issue_date, passport_department_code, passport_issued_by, ' +
      'registration_area, registration_city, registration_street, registration_house, ' +
      'registration_building, registration_apartment, created_at, updated_at',
      [
        last_name, first_name, middle_name, date_of_birth,
        passport_series, passport_number, passport_issue_date,
        passport_department_code, passport_issued_by,
        registration_area, registration_city, registration_street,
        registration_house, registration_building, registration_apartment
      ]
    );

    return result.rows[0];
  }

  @LogChanges('employee')
  async update(id: number, updateEmployeeDto: UpdateEmployeeDto, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM employees WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Невозможно обновить удаленного сотрудника с ID ${id}`);
    }

    const { updateFields, values, valueIndex } = buildUpdateQuery(updateEmployeeDto);

    if (updateFields.length === 0) {
      return this.findOne(id);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await (client || this.dbService).query(
      `UPDATE employees SET ${updateFields.join(', ')} WHERE id = $${valueIndex} AND deleted_at IS NULL ` +
      'RETURNING id, last_name, first_name, middle_name, date_of_birth, passport_series, ' +
      'passport_number, passport_issue_date, passport_department_code, passport_issued_by, ' +
      'registration_area, registration_city, registration_street, registration_house, ' +
      'registration_building, registration_apartment, created_at, updated_at',
      values
    );

    return result.rows[0];
  }

  @LogChanges('employee')
  async softDelete(id: number, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM employees WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Сотрудник с ID ${id} уже удален`);
    }

    const result = await (client || this.dbService).query(
      'UPDATE employees SET deleted_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $1 AND deleted_at IS NULL ' +
      'RETURNING id, last_name, first_name, middle_name, date_of_birth, passport_series, ' +
      'passport_number, passport_issue_date, passport_department_code, passport_issued_by, ' +
      'registration_area, registration_city, registration_street, registration_house, ' +
      'registration_building, registration_apartment, created_at, updated_at, deleted_at',
      [id]
    );

    return result.rows[0];
  }
} 