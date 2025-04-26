import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { buildUpdateQuery } from '../../utils/db-update.utils';
import { LogChanges } from '../../decorators/log-changes.decorator';
import { PoolClient } from 'pg';
import { Request } from 'express';

@Injectable()
export class EmployeesService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT e.id, e.last_name, e.first_name, e.middle_name, e.date_of_birth, ' +
      'e.passport_series, e.passport_number, e.passport_issue_date, e.passport_department_code, ' +
      'e.passport_issued_by, e.registration_area, e.registration_city, e.registration_street, ' +
      'e.registration_house, e.registration_building, e.registration_apartment, e.created_at, e.updated_at, ' +
      'd.name as department_name, p.name as position_name, ho.salary ' +
      'FROM employees e ' +
      'LEFT JOIN LATERAL ( ' +
      '  SELECT department_id, position_id, salary ' +
      '  FROM hr_operations ' +
      '  WHERE employee_id = e.id AND deleted_at IS NULL ' +
      '  ORDER BY action_date DESC, created_at DESC ' +
      '  LIMIT 1 ' +
      ') ho ON true ' +
      'LEFT JOIN departments d ON d.id = ho.department_id ' +
      'LEFT JOIN positions p ON p.id = ho.position_id ' +
      'WHERE e.deleted_at IS NULL ' +
      'ORDER BY e.id'
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT e.id, e.last_name, e.first_name, e.middle_name, e.date_of_birth, ' +
      'e.passport_series, e.passport_number, e.passport_issue_date, e.passport_department_code, ' +
      'e.passport_issued_by, e.registration_area, e.registration_city, e.registration_street, ' +
      'e.registration_house, e.registration_building, e.registration_apartment, e.created_at, e.updated_at, ' +
      'd.name as department_name, p.name as position_name, ho.salary ' +
      'FROM employees e ' +
      'LEFT JOIN LATERAL ( ' +
      '  SELECT department_id, position_id, salary ' +
      '  FROM hr_operations ' +
      '  WHERE employee_id = e.id AND deleted_at IS NULL ' +
      '  ORDER BY action_date DESC, created_at DESC ' +
      '  LIMIT 1 ' +
      ') ho ON true ' +
      'LEFT JOIN departments d ON d.id = ho.department_id ' +
      'LEFT JOIN positions p ON p.id = ho.position_id ' +
      'WHERE e.id = $1 AND e.deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }

    return result.rows[0];
  }

  @LogChanges('employee')
  async create(request: Request, createEmployeeDto: CreateEmployeeDto, client?: PoolClient) {
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
  async update(request: Request, id: number, updateEmployeeDto: UpdateEmployeeDto, client?: PoolClient) {
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
  async softDelete(request: Request, id: number, client?: PoolClient) {
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