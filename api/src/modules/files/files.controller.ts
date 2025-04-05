import { Controller, Get, Post, Delete, Body, Param, Put, ParseIntPipe } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createFileSchema, updateFileSchema } from './validation/file.schema';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.findOne(id);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createFileSchema))
    createFileDto: CreateFileDto,
  ) {
    return this.filesService.create(createFileDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updateFileSchema))
    updateFileDto: UpdateFileDto,
  ) {
    return this.filesService.update(id, updateFileDto);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.softDelete(id);
  }
} 