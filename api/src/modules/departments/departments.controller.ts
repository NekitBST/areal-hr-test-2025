import { Controller, Get, Post, Delete, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createDepartmentSchema, updateDepartmentSchema } from './validation/department.schema';
import { DatabaseService } from '../../common/services/database.service';

@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly dbService: DatabaseService
  ) {}

  @Get()
  async findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createDepartmentSchema))
    createDepartmentDto: CreateDepartmentDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.departmentsService.create(createDepartmentDto, client);
    });
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.withTransaction(async (client) => {
      return this.departmentsService.softDelete(id, client);
    });
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updateDepartmentSchema))
    updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.departmentsService.update(id, updateDepartmentDto, client);
    });
  }
}
