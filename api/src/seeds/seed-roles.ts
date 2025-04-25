import { DatabaseService } from '../common/services/database.service';
import { Role } from '../modules/auth/enums/role.enum';

export async function seedRoles(dbService: DatabaseService) {
  await dbService.query('TRUNCATE roles CASCADE');

  const roles = [
    { name: Role.ADMIN },
    { name: Role.MANAGER }
  ];

  for (const role of roles) {
    await dbService.query(
      'INSERT INTO roles (name) VALUES ($1) RETURNING id',
      [role.name]
    );
  }

  console.log('Роли созданы');
} 