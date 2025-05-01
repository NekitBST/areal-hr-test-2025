import { Controller, Get, Post, Delete, Body, Param, Put, ParseIntPipe, UseGuards, Req, Query } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { FindAllOrganizationsDto } from './dto/find-all-organizations.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createOrganizationSchema, updateOrganizationSchema, findAllOrganizationsSchema } from './validation/organization.schema';
import { DatabaseService } from '../../common/services/database.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { Request } from 'express';

@Controller('organizations')
@UseGuards(AuthenticatedGuard, RoleGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly dbService: DatabaseService
  ) {}

  @Get()
  async findAll(
    @Query(new JoiValidationPipe(findAllOrganizationsSchema))
    query: FindAllOrganizationsDto,
  ) {
    return this.organizationsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.findOne(id);
  }

  @Post()
  async create(
    @Req() request: Request,
    @Body(new JoiValidationPipe(createOrganizationSchema))
    createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.organizationsService.create(request, createOrganizationDto, client);
    });
  }

  @Delete(':id')
  async softDelete(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.organizationsService.softDelete(request, id, client);
    });
  }

  @Put(':id')
  async update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updateOrganizationSchema))
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.organizationsService.update(request, id, updateOrganizationDto, client);
    });
  }
}
