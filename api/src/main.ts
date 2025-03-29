import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { execSync } from 'child_process';
import { join } from 'path';

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
  
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  app.enableCors();

  await app.listen(appConfig.port);
  console.log(`Приложение работает: http://localhost:${appConfig.port}`);
}
bootstrap();