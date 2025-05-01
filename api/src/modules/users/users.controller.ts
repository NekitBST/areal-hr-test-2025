import { Controller, Get, Post, Delete, Body, Param, Put, ParseIntPipe, UseGuards, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createUserSchema, updateUserSchema, findAllUsersSchema } from './validation/user.schema';
import { DatabaseService } from '../../common/services/database.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { Request } from 'express';

@Controller('users')
@UseGuards(AuthenticatedGuard, RoleGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly dbService: DatabaseService
  ) {}

  @Get()
  async findAll(
    @Query(new JoiValidationPipe(findAllUsersSchema))
    params: FindAllUsersDto
  ) {
    return this.usersService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(
    @Req() request: Request,
    @Body(new JoiValidationPipe(createUserSchema))
    createUserDto: CreateUserDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.usersService.create(request, createUserDto, client);
    });
  }

  @Delete(':id')
  async softDelete(@Req() request: Request, 
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.usersService.softDelete(request, id, client);
    });
  }

  @Put(':id')
  async update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updateUserSchema))
    updateUserDto: UpdateUserDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.usersService.update(request, id, updateUserDto, client);
    });
  }
} 