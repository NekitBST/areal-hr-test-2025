import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, last_name, first_name, middle_name, date_of_birth, passport_series, passport_number, ' +
      'passport_issue_date, passport_department_code, passport_issued_by, registration_area, registration_city, ' +
      'registration_street, registration_house, registration_building, registration_apartment, ' +
      'created_at, updated_at, deleted, deleted_at FROM employees ORDER BY id'
    );

    return result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, last_name, first_name, middle_name, date_of_birth, passport_series, passport_number, ' +
      'passport_issue_date, passport_department_code, passport_issued_by, registration_area, registration_city, ' +
      'registration_street, registration_house, registration_building, registration_apartment, ' +
      'created_at, updated_at, deleted, deleted_at FROM employees WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }

    const { deleted, deleted_at, ...row } = result.rows[0];
    return deleted ? { ...row, deleted_at } : row;
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const {
      last_name, first_name, middle_name, date_of_birth,
      passport_series, passport_number, passport_issue_date,
      passport_department_code, passport_issued_by,
      registration_area, registration_city, registration_street,
      registration_house, registration_building, registration_apartment
    } = createEmployeeDto;

    const result = await this.dbService.query(
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

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const checkResult = await this.dbService.query(
      'SELECT deleted FROM employees WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted) {
      throw new BadRequestException(`Невозможно обновить удаленного сотрудника с ID ${id}`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    if (updateEmployeeDto.last_name !== undefined) {
      updateFields.push(`last_name = $${valueIndex}`);
      values.push(updateEmployeeDto.last_name);
      valueIndex++;
    }

    if (updateEmployeeDto.first_name !== undefined) {
      updateFields.push(`first_name = $${valueIndex}`);
      values.push(updateEmployeeDto.first_name);
      valueIndex++;
    }

    if (updateEmployeeDto.middle_name !== undefined) {
      updateFields.push(`middle_name = $${valueIndex}`);
      values.push(updateEmployeeDto.middle_name);
      valueIndex++;
    }

    if (updateEmployeeDto.date_of_birth !== undefined) {
      updateFields.push(`date_of_birth = $${valueIndex}`);
      values.push(updateEmployeeDto.date_of_birth);
      valueIndex++;
    }

    if (updateEmployeeDto.passport_series !== undefined) {
      updateFields.push(`passport_series = $${valueIndex}`);
      values.push(updateEmployeeDto.passport_series);
      valueIndex++;
    }

    if (updateEmployeeDto.passport_number !== undefined) {
      updateFields.push(`passport_number = $${valueIndex}`);
      values.push(updateEmployeeDto.passport_number);
      valueIndex++;
    }

    if (updateEmployeeDto.passport_issue_date !== undefined) {
      updateFields.push(`passport_issue_date = $${valueIndex}`);
      values.push(updateEmployeeDto.passport_issue_date);
      valueIndex++;
    }

    if (updateEmployeeDto.passport_department_code !== undefined) {
      updateFields.push(`passport_department_code = $${valueIndex}`);
      values.push(updateEmployeeDto.passport_department_code);
      valueIndex++;
    }

    if (updateEmployeeDto.passport_issued_by !== undefined) {
      updateFields.push(`passport_issued_by = $${valueIndex}`);
      values.push(updateEmployeeDto.passport_issued_by);
      valueIndex++;
    }

    if (updateEmployeeDto.registration_area !== undefined) {
      updateFields.push(`registration_area = $${valueIndex}`);
      values.push(updateEmployeeDto.registration_area);
      valueIndex++;
    }

    if (updateEmployeeDto.registration_city !== undefined) {
      updateFields.push(`registration_city = $${valueIndex}`);
      values.push(updateEmployeeDto.registration_city);
      valueIndex++;
    }

    if (updateEmployeeDto.registration_street !== undefined) {
      updateFields.push(`registration_street = $${valueIndex}`);
      values.push(updateEmployeeDto.registration_street);
      valueIndex++;
    }

    if (updateEmployeeDto.registration_house !== undefined) {
      updateFields.push(`registration_house = $${valueIndex}`);
      values.push(updateEmployeeDto.registration_house);
      valueIndex++;
    }

    if (updateEmployeeDto.registration_building !== undefined) {
      updateFields.push(`registration_building = $${valueIndex}`);
      values.push(updateEmployeeDto.registration_building);
      valueIndex++;
    }

    if (updateEmployeeDto.registration_apartment !== undefined) {
      updateFields.push(`registration_apartment = $${valueIndex}`);
      values.push(updateEmployeeDto.registration_apartment);
      valueIndex++;
    }

    if (updateFields.length === 0) {
      return this.findOne(id);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await this.dbService.query(
      `UPDATE employees SET ${updateFields.join(', ')} WHERE id = $${valueIndex} ` +
      'RETURNING id, last_name, first_name, middle_name, date_of_birth, passport_series, ' +
      'passport_number, passport_issue_date, passport_department_code, passport_issued_by, ' +
      'registration_area, registration_city, registration_street, registration_house, ' +
      'registration_building, registration_apartment, created_at, updated_at',
      values
    );

    return result.rows[0];
  }

  async softDelete(id: number) {
    const checkResult = await this.dbService.query(
      'SELECT deleted FROM employees WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted) {
      throw new BadRequestException(`Сотрудник с ID ${id} уже удален`);
    }

    const result = await this.dbService.query(
      'UPDATE employees SET deleted = true, deleted_at = CURRENT_TIMESTAMP, ' +
      'updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    return result.rows[0];
  }
} 