import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DatabaseService],
})
export class DepartmentsModule {}
