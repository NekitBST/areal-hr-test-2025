import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './common/services/database.service';
import { OrganizationsModule } from './modules/organizations/organizations.module';

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
  ],
  controllers: [AppController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}