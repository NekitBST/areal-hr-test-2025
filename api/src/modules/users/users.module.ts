import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DatabaseService],
})
export class UsersModule {} 