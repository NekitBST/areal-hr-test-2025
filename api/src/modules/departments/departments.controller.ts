import { Controller, Get, Post, Delete, Put, Body, Param, ParseIntPipe, UseGuards, Req, Query } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { FindAllDepartmentsDto } from './dto/find-all-departments.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createDepartmentSchema, updateDepartmentSchema, findAllDepartmentsSchema } from './validation/department.schema';
import { DatabaseService } from '../../common/services/database.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { Request } from 'express';

@Controller('departments')
@UseGuards(AuthenticatedGuard, RoleGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly dbService: DatabaseService
  ) {}

  @Get()
  async findAll(
    @Query(new JoiValidationPipe(findAllDepartmentsSchema))
    query: FindAllDepartmentsDto,
  ) {
    return this.departmentsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Post()
  async create(
    @Req() request: Request,
    @Body(new JoiValidationPipe(createDepartmentSchema))
    createDepartmentDto: CreateDepartmentDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.departmentsService.create(request, createDepartmentDto, client);
    });
  }

  @Delete(':id')
  async softDelete(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.departmentsService.softDelete(request, id, client);
    });
  }

  @Put(':id')
  async update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updateDepartmentSchema))
    updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.departmentsService.update(request, id, updateDepartmentDto, client);
    });
  }
}
