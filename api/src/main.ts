import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.setGlobalPrefix('api');
  
  app.enableCors();

  app.useStaticAssets(join(__dirname, '..', 'files'), {
    prefix: '/files/',
  });

  await app.listen(appConfig.port);
  console.log(`Приложение работает: http://localhost:${appConfig.port}`);
}
bootstrap();