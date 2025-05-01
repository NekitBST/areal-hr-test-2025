import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ChangeHistoryService } from './change-history.service';
import { FindAllChangeHistoryDto } from './dto/find-all-change-history.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { findAllChangeHistorySchema } from './validation/change-history.schema';

@Controller('change-history')
export class ChangeHistoryController {
  constructor(private readonly changeHistoryService: ChangeHistoryService) {}

  @Get()
  async findAll(
    @Query(new JoiValidationPipe(findAllChangeHistorySchema))
    params: FindAllChangeHistoryDto
  ) {
    return this.changeHistoryService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.changeHistoryService.findOne(id);
  }
} 