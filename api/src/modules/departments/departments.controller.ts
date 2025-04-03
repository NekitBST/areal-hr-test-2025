import { Controller, Get, Post, Delete, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createDepartmentSchema, updateDepartmentSchema } from './validation/department.schema';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll() {
    return this.departmentsService.findAll();
  }

  @Get('tree')
  async findAllTree() {
    return this.departmentsService.findAllTree();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Get(':id/tree')
  async findOneWithTree(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOneWithTree(id);
  }

  @Get('organization/:organizationId')
  async findByOrganization(@Param('organizationId', ParseIntPipe) organizationId: number) {
    return this.departmentsService.findByOrganization(organizationId);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createDepartmentSchema))
    createDepartmentDto: CreateDepartmentDto,
  ) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updateDepartmentSchema))
    updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.softDelete(id);
  }
}
