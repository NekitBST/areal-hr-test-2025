import { Controller, Get, Post, Delete, Put, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { HrOperationsService } from './hr-operations.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createHrOperationSchema, updateHrOperationSchema } from './validation/hr-operation.schema';
import { DatabaseService } from '../../common/services/database.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('hr-operations')
@UseGuards(AuthenticatedGuard, RoleGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class HrOperationsController {
  constructor(
    private readonly hrOperationsService: HrOperationsService,
    private readonly dbService: DatabaseService
  ) {}

  @Get()
  async findAll() {
    return this.hrOperationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hrOperationsService.findOne(id);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createHrOperationSchema))
    createHrOperationDto: CreateHrOperationDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.hrOperationsService.create(createHrOperationDto, client);
    });
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.withTransaction(async (client) => {
      return this.hrOperationsService.softDelete(id, client);
    });
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updateHrOperationSchema))
    updateHrOperationDto: UpdateHrOperationDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.hrOperationsService.update(id, updateHrOperationDto, client);
    });
  }
} 