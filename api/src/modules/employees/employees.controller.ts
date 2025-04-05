import { Controller, Get, Post, Delete, Body, Param, Put, ParseIntPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createEmployeeSchema, updateEmployeeSchema } from './validation/employee.schema';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createEmployeeSchema))
    createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updateEmployeeSchema))
    updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.softDelete(id);
  }
} 