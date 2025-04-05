import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ChangeHistoryService } from './change-history.service';
import { CreateChangeHistoryDto } from './dto/create-change-history.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createChangeHistorySchema } from './validation/change-history.schema';

@Controller('change-history')
export class ChangeHistoryController {
  constructor(private readonly changeHistoryService: ChangeHistoryService) {}

  @Get()
  async findAll() {
    return this.changeHistoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.changeHistoryService.findOne(id);
  }

  @Get('type/:objectType')
  async findByObjectType(@Param('objectType') objectType: string) {
    return this.changeHistoryService.findByObjectType(objectType);
  }

  @Get('object/:objectType/:objectId')
  async findByObjectId(
    @Param('objectType') objectType: string,
    @Param('objectId', ParseIntPipe) objectId: number
  ) {
    return this.changeHistoryService.findByObjectId(objectType, objectId);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createChangeHistorySchema))
    createChangeHistoryDto: CreateChangeHistoryDto,
  ) {
    return this.changeHistoryService.create(createChangeHistoryDto);
  }
} 