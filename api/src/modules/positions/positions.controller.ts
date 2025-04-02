import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

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

  @Delete('delete/:id')
  async softDelete(@Param('id') id: string) {
    return this.positionsService.softDelete(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
    return this.positionsService.update(Number(id), updatePositionDto);
  }
}
