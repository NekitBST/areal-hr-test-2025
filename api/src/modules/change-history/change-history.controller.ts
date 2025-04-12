import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ChangeHistoryService } from './change-history.service';

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
} 