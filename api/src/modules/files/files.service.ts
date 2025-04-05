import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT id, name, file_path, employee_id, created_at, update_at, deleted, deleted_at FROM files ORDER BY id'
    );

    return result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT id, name, file_path, employee_id, created_at, update_at, deleted, deleted_at FROM files WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }

    const { deleted, deleted_at, ...row } = result.rows[0];
    return deleted ? { ...row, deleted_at } : row;
  }

  async create(createFileDto: CreateFileDto) {
    const employeeExists = await this.dbService.query(
      'SELECT id FROM employees WHERE id = $1 AND NOT deleted',
      [createFileDto.employee_id]
    );

    if (employeeExists.rows.length === 0) {
      throw new BadRequestException(`Сотрудник с ID ${createFileDto.employee_id} не найден или удален`);
    }

    const { name, file_path, employee_id } = createFileDto;
    const result = await this.dbService.query(
      'INSERT INTO files (name, file_path, employee_id) VALUES ($1, $2, $3) RETURNING id, name, file_path, employee_id, created_at, update_at',
      [name, file_path, employee_id]
    );

    return result.rows[0];
  }

  async update(id: number, updateFileDto: UpdateFileDto) {
    const checkResult = await this.dbService.query(
      'SELECT deleted FROM files WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted) {
      throw new BadRequestException(`Невозможно обновить удаленный файл с ID ${id}`);
    }

    if (updateFileDto.employee_id) {
      const employeeExists = await this.dbService.query(
        'SELECT id FROM employees WHERE id = $1 AND NOT deleted',
        [updateFileDto.employee_id]
      );

      if (employeeExists.rows.length === 0) {
        throw new BadRequestException(`Сотрудник с ID ${updateFileDto.employee_id} не найден или удален`);
      }
    }

    const updateFields: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    if (updateFileDto.name !== undefined) {
      updateFields.push(`name = $${valueIndex}`);
      values.push(updateFileDto.name);
      valueIndex++;
    }

    if (updateFileDto.file_path !== undefined) {
      updateFields.push(`file_path = $${valueIndex}`);
      values.push(updateFileDto.file_path);
      valueIndex++;
    }

    if (updateFileDto.employee_id !== undefined) {
      updateFields.push(`employee_id = $${valueIndex}`);
      values.push(updateFileDto.employee_id);
      valueIndex++;
    }

    if (updateFields.length === 0) {
      return this.findOne(id);
    }

    updateFields.push('update_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await this.dbService.query(
      `UPDATE files SET ${updateFields.join(', ')} WHERE id = $${valueIndex} RETURNING id, name, file_path, employee_id, created_at, update_at`,
      values
    );

    return result.rows[0];
  }

  async softDelete(id: number) {
    const checkResult = await this.dbService.query(
      'SELECT deleted FROM files WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted) {
      throw new BadRequestException(`Файл с ID ${id} уже удален`);
    }

    const result = await this.dbService.query(
      'UPDATE files SET deleted = true, deleted_at = CURRENT_TIMESTAMP, update_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    return result.rows[0];
  }
} 