import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.setGlobalPrefix('api');
  
  app.enableCors({
    origin: appConfig.frontendUrl,
    credentials: true,
  });

  app.use(
    session({
      secret: appConfig.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useStaticAssets(join(process.cwd(), '..', 'files'), {
    prefix: '/files/',
  });

  await app.listen(appConfig.port);
  console.log(`Приложение работает: http://localhost:${appConfig.port}`);
}
bootstrap();