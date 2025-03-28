import { Controller, Get, Param } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll() {
    return this.departmentsService.findAll();
  }

  @Get('tree')
  async findAllTree() {
    return this.departmentsService.findAllTree();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(Number(id));
  }

  @Get(':id/tree')
  async findOneWithTree(@Param('id') id: string) {
    return this.departmentsService.findOneWithTree(Number(id));
  }

  @Get('organization/:organizationId')
  async findByOrganization(@Param('organizationId') organizationId: string) {
    return this.departmentsService.findByOrganization(Number(organizationId));
  }
}
