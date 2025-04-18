import { Controller, Get, Post, Delete, Body, Param, Put, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createUserSchema, updateUserSchema } from './validation/user.schema';
import { DatabaseService } from '../../common/services/database.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly dbService: DatabaseService
  ) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createUserSchema))
    createUserDto: CreateUserDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.usersService.create(createUserDto, client);
    });
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.withTransaction(async (client) => {
      return this.usersService.softDelete(id, client);
    });
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updateUserSchema))
    updateUserDto: UpdateUserDto,
  ) {
    return this.dbService.withTransaction(async (client) => {
      return this.usersService.update(id, updateUserDto, client);
    });
  }
} 