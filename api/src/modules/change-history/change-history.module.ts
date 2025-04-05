import { Module } from '@nestjs/common';
import { ChangeHistoryController } from './change-history.controller';
import { ChangeHistoryService } from './change-history.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
  controllers: [ChangeHistoryController],
  providers: [ChangeHistoryService, DatabaseService],
})
export class ChangeHistoryModule {} 