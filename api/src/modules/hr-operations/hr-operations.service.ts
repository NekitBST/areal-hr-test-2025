import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';

@Injectable()
export class HrOperationsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      `SELECT * FROM hr_operations ORDER BY id`
    );

    return result.rows.map(({ deleted, deleted_at, ...row }) =>
      deleted ? { ...row, deleted_at } : row
    );
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT * FROM hr_operations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Кадровая операция с ID ${id} не найдена`);
    }

    const { deleted, deleted_at, ...row } = result.rows[0];
    return deleted ? { ...row, deleted_at } : row;
  }

  async create(createHrOperationDto: CreateHrOperationDto) {
    const { employee_id, department_id, position_id, salary, action } = createHrOperationDto;
    
    const result = await this.dbService.query(
      `INSERT INTO hr_operations 
        (employee_id, department_id, position_id, salary, action) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [employee_id, department_id, position_id, salary, action]
    );
    
    return result.rows[0];
  }

  async update(id: number, updateHrOperationDto: UpdateHrOperationDto) {
    const checkResult = await this.dbService.query(
      'SELECT deleted FROM hr_operations WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Кадровая операция с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted) {
      throw new BadRequestException(`Невозможно обновить удаленную кадровую операцию с ID ${id}`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    Object.entries(updateHrOperationDto).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${valueIndex}`);
        values.push(value);
        valueIndex++;
      }
    });

    if (updateFields.length === 0) {
      return this.findOne(id);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await this.dbService.query(
      `UPDATE hr_operations SET ${updateFields.join(', ')} 
      WHERE id = $${valueIndex} 
      RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async softDelete(id: number) {
    const checkResult = await this.dbService.query(
      'SELECT deleted FROM hr_operations WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Кадровая операция с ID ${id} не найдена`);
    }

    if (checkResult.rows[0].deleted) {
      throw new BadRequestException(`Кадровая операция с ID ${id} уже удалена`);
    }

    const result = await this.dbService.query(
      `UPDATE hr_operations 
      SET deleted = true, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *`,
      [id]
    );

    return result.rows[0];
  }
} 