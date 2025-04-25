import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { RoleGuard } from './guards/role.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: true }),
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer, RoleGuard],
  controllers: [AuthController],
  exports: [RoleGuard],
})
export class AuthModule {} 