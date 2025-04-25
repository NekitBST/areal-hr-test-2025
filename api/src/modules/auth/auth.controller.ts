import { Controller, Post, UseGuards, Request, Session, HttpCode } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(AuthenticatedGuard)
  async logout(@Session() session) {
    session.destroy();
    return { message: 'Выход выполнен успешно' };
  }
} 