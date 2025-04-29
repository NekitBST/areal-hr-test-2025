import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), '..', 'files'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        }
      })
    })
  ],
  controllers: [FilesController],
  providers: [FilesService, DatabaseService],
})
export class FilesModule {}