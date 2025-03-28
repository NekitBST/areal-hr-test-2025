import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './common/services/database.service';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { message: 'Проверка API' };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrganizationsModule,
    DepartmentsModule,
    PositionsModule
  ],
  controllers: [AppController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}