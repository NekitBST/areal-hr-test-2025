import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.positionsService.findOne(Number(id));
  }

  @Post()
  async create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Patch('delete/:id')
  async softDelete(@Param('id') id: string) {
    return this.positionsService.softDelete(Number(id));
  }
}
