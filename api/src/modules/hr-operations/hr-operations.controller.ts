import { Controller, Get, Post, Delete, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { HrOperationsService } from './hr-operations.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createHrOperationSchema, updateHrOperationSchema } from './validation/hr-operation.schema';

@Controller('hr-operations')
export class HrOperationsController {
  constructor(private readonly hrOperationsService: HrOperationsService) {}

  @Get()
  async findAll() {
    return this.hrOperationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hrOperationsService.findOne(id);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createHrOperationSchema))
    createHrOperationDto: CreateHrOperationDto,
  ) {
    return this.hrOperationsService.create(createHrOperationDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(updateHrOperationSchema))
    updateHrOperationDto: UpdateHrOperationDto,
  ) {
    return this.hrOperationsService.update(id, updateHrOperationDto);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.hrOperationsService.softDelete(id);
  }
} 