import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  app.enableCors();

  await app.listen(appConfig.port);
  console.log(`Application is running on: http://localhost:${appConfig.port}`);
}
bootstrap();