import { DatabaseService } from '../common/services/database.service';
import * as argon2 from 'argon2';

export async function seedUsers(dbService: DatabaseService) {

  const rolesResult = await dbService.query(
    'SELECT id, name FROM roles WHERE name IN ($1, $2)',
    ['Администратор', 'Менеджер по персоналу']
  );
  
  const roles = rolesResult.rows.reduce((acc, role) => {
    acc[role.name] = role.id;
    return acc;
  }, {});

  const users = [
    {
      last_name: 'Смирнов',
      first_name: 'Андрей',
      middle_name: 'Валерьевич',
      login: 'admin',
      password: 'admin123',
      role_id: roles['Администратор']
    },
    {
      last_name: 'Иванова',
      first_name: 'Екатерина',
      middle_name: 'Александровна',
      login: 'hr_manager',
      password: 'hr_manager123',
      role_id: roles['Менеджер по персоналу']
    }
  ];

  for (const user of users) {
    const password_hash = await argon2.hash(user.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4
    });

    await dbService.query(
      'INSERT INTO users (last_name, first_name, middle_name, login, password_hash, role_id) ' +
      'VALUES ($1, $2, $3, $4, $5, $6)',
      [user.last_name, user.first_name, user.middle_name, user.login, password_hash, user.role_id]
    );
  }

  console.log('Пользователи созданы');
} 