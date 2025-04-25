import { Controller, Get, Post, Delete, Put, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createPositionSchema, updatePositionSchema } from './validation/position.schema';
import { DatabaseService } from '../../common/services/database.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('positions')
@UseGuards(AuthenticatedGuard, RoleGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class PositionsController {
  constructor(
    private readonly positionsService: PositionsService,
    private readonly dbService: DatabaseService
  ) {}

  @Get()
  async findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.positionsService.findOne(id);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createPositionSchema))
    createPositionDto: CreatePositionDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.positionsService.create(createPositionDto, client);
    });
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.withTransaction(async (client) => {
      return this.positionsService.softDelete(id, client);
    });
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updatePositionSchema))
    updatePositionDto: UpdatePositionDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.positionsService.update(id, updatePositionDto, client);
    });
  }
}
