import { Controller, Get, Post, Delete, Put, Body, Param, ParseIntPipe, UseGuards, Req, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FindAllEmployeesDto } from './dto/find-all-employees.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createEmployeeSchema, updateEmployeeSchema, findAllEmployeesSchema } from './validation/employee.schema';
import { DatabaseService } from '../../common/services/database.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { Request } from 'express';

@Controller('employees')
@UseGuards(AuthenticatedGuard, RoleGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly dbService: DatabaseService
  ) {}

  @Get()
  async findAll(
    @Query(new JoiValidationPipe(findAllEmployeesSchema))
    query: FindAllEmployeesDto,
  ) {
    return this.employeesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Post()
  async create(
    @Req() request: Request,
    @Body(new JoiValidationPipe(createEmployeeSchema))
    createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.employeesService.create(request, createEmployeeDto, client);
    });
  }

  @Delete(':id')
  async softDelete(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.employeesService.softDelete(request, id, client);
    });
  }

  @Put(':id')
  async update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updateEmployeeSchema))
    updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.employeesService.update(request, id, updateEmployeeDto, client);
    });
  }
} 