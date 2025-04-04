import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, DatabaseService],
})
export class FilesModule {} 