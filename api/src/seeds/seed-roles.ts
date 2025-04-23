import { DatabaseService } from '../common/services/database.service';

export async function seedRoles(dbService: DatabaseService) {
  await dbService.query('TRUNCATE roles CASCADE');

  const roles = [
    { name: 'Администратор' },
    { name: 'Менеджер по персоналу' }
  ];

  for (const role of roles) {
    await dbService.query(
      'INSERT INTO roles (name) VALUES ($1) RETURNING id',
      [role.name]
    );
  }

  console.log('Роли созданы');
} 