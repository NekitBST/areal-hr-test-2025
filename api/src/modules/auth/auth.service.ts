import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.usersService.findByLogin(login);
    
    if (user && await argon2.verify(user.password_hash, password)) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }
} 