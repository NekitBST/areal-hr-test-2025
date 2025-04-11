import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { execSync } from 'child_process';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function runMigrations() {
  try {
    console.log('Запуск миграций...');
    execSync('npm run migrate:up', {
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    });
    console.log('Миграции успешно выполнены');
  } catch (error) {
    console.error('Ошибка при выполнении миграций:', error);
    process.exit(1);
  }
}

async function bootstrap() {
  await runMigrations();
  
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