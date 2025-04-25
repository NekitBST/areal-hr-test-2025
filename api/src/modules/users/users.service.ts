import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { buildUpdateQuery } from '../../utils/db-update.utils';
import { LogChanges } from '../../decorators/log-changes.decorator';
import { PoolClient } from 'pg';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query(
      'SELECT u.id, u.last_name, u.first_name, u.middle_name, u.login, ' +
      'u.created_at, u.updated_at, u.role_id, r.name as role_name ' +
      'FROM users u ' +
      'JOIN roles r ON u.role_id = r.id ' +
      'WHERE u.deleted_at IS NULL ' +
      'ORDER BY u.id'
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT u.id, u.last_name, u.first_name, u.middle_name, u.login, ' +
      'u.created_at, u.updated_at, u.role_id, r.name as role_name ' +
      'FROM users u ' +
      'JOIN roles r ON u.role_id = r.id ' +
      'WHERE u.id = $1 AND u.deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return result.rows[0];
  }

  @LogChanges('user')
  async create(createUserDto: CreateUserDto, client?: PoolClient) {
    const { last_name, first_name, middle_name, login, password, role_id } = createUserDto;

    const checkLogin = await (client || this.dbService).query(
      'SELECT id FROM users WHERE login = $1 AND deleted_at IS NULL',
      [login]
    );

    if (checkLogin.rows.length > 0) {
      throw new BadRequestException('Пользователь с таким логином уже существует');
    }

    const password_hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4
    });

    const result = await (client || this.dbService).query(
      'INSERT INTO users (last_name, first_name, middle_name, login, password_hash, role_id) ' +
      'VALUES ($1, $2, $3, $4, $5, $6) ' +
      'RETURNING id, last_name, first_name, middle_name, login, role_id, created_at, updated_at',
      [last_name, first_name, middle_name, login, password_hash, role_id]
    );

    const user = result.rows[0];
    const roleResult = await (client || this.dbService).query(
      'SELECT name as role_name FROM roles WHERE id = $1',
      [user.role_id]
    );
    
    return { ...user, role_name: roleResult.rows[0].name };
  }

  @LogChanges('user')
  async update(id: number, updateUserDto: UpdateUserDto, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM users WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Невозможно обновить удаленного пользователя с ID ${id}`);
    }

    if (updateUserDto.login) {
      const checkLogin = await (client || this.dbService).query(
        'SELECT id FROM users WHERE login = $1 AND id != $2 AND deleted_at IS NULL',
        [updateUserDto.login, id]
      );

      if (checkLogin.rows.length > 0) {
        throw new BadRequestException('Пользователь с таким логином уже существует');
      }
    }

    if (updateUserDto.password) {
      const password_hash = await argon2.hash(updateUserDto.password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4
      });
      updateUserDto['password_hash'] = password_hash;
      delete updateUserDto.password;
    }

    const { updateFields, values, valueIndex } = buildUpdateQuery(updateUserDto);

    if (updateFields.length === 0) {
      return this.findOne(id);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await (client || this.dbService).query(
      `UPDATE users SET ${updateFields.join(', ')} ` +
      `WHERE id = $${valueIndex} AND deleted_at IS NULL ` +
      'RETURNING id, last_name, first_name, middle_name, login, role_id, created_at, updated_at',
      values
    );

    const user = result.rows[0];
    const roleResult = await (client || this.dbService).query(
      'SELECT name as role_name FROM roles WHERE id = $1',
      [user.role_id]
    );
    
    return { ...user, role_name: roleResult.rows[0].name };
  }

  @LogChanges('user')
  async softDelete(id: number, client?: PoolClient) {
    const checkResult = await (client || this.dbService).query(
      'SELECT deleted_at FROM users WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    if (checkResult.rows[0].deleted_at !== null) {
      throw new BadRequestException(`Пользователь с ID ${id} уже удален`);
    }

    const result = await (client || this.dbService).query(
      'UPDATE users SET deleted_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $1 AND deleted_at IS NULL ' +
      'RETURNING id, last_name, first_name, middle_name, login, role_id, created_at, updated_at, deleted_at',
      [id]
    );

    return result.rows[0];
  }

  async findByLogin(login: string) {
    const result = await this.dbService.query(
      'SELECT u.id, u.last_name, u.first_name, u.middle_name, u.login, u.password_hash, ' +
      'u.created_at, u.updated_at, u.role_id, r.name as role_name ' +
      'FROM users u ' +
      'JOIN roles r ON u.role_id = r.id ' +
      'WHERE u.login = $1 AND u.deleted_at IS NULL',
      [login]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }
} 