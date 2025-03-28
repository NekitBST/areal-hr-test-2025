import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService, DatabaseService],
})
export class PositionsModule {}
