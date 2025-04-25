import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './common/services/database.service';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { FilesModule } from './modules/files/files.module';
import { HrOperationsModule } from './modules/hr-operations/hr-operations.module';
import { ChangeHistoryModule } from './modules/change-history/change-history.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

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
    PositionsModule,
    EmployeesModule,
    FilesModule,
    HrOperationsModule,
    ChangeHistoryModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}