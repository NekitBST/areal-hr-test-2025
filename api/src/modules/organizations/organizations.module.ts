import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, DatabaseService],
})
export class OrganizationsModule {}
