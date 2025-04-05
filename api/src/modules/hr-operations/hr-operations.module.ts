import { Module } from '@nestjs/common';
import { HrOperationsController } from './hr-operations.controller';
import { HrOperationsService } from './hr-operations.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
  controllers: [HrOperationsController],
  providers: [HrOperationsService, DatabaseService],
})
export class HrOperationsModule {} 