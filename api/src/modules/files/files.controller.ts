import { Controller, Get, Post, Delete, Body, Param, Put, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createFileSchema, updateFileSchema } from './validation/file.schema';
import { DatabaseService } from '../../common/services/database.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly dbService: DatabaseService
  ) {}

  @Get()
  async findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file_path', {
    storage: diskStorage({
      destination: './files',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
        return cb(null, false);
      }
      cb(null, true);
    }
  }))
  async create(
    @UploadedFile() file,
    @Body(new JoiValidationPipe(createFileSchema)) createFileDto: CreateFileDto,
  ) {
    createFileDto.file_path = file.path.replace(/\\/g, '/');
    return this.dbService.withTransaction(async (client) => {
      return this.filesService.create(createFileDto, client);
    });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file_path', {
    storage: diskStorage({
      destination: './files',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
        return cb(null, false);
      }
      cb(null, true);
    }
  }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file,
    @Body(new JoiValidationPipe(updateFileSchema)) updateFileDto: UpdateFileDto,
  ) {
    if (file) {
      updateFileDto.file_path = file.path.replace(/\\/g, '/');
    }
    return this.dbService.withTransaction(async (client) => {
      return this.filesService.update(id, updateFileDto, client);
    });
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.withTransaction(async (client) => {
      return this.filesService.softDelete(id, client);
    });
  }
} 