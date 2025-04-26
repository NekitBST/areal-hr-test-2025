import { DatabaseService } from '../common/services/database.service';
import { seedUsers } from './seed-users';
import { seedOrganizations } from './seed-organizations';
import { seedDepartments } from './seed-departments';
import { seedPositions } from './seed-positions';
import { seedEmployees } from './seed-employees';
import { seedHrOperations } from './seed-hr-operations';
import { seedFiles } from './seed-files';

export async function seed() {
  const dbService = new DatabaseService();
  
  try {
    console.log('Начало заполнения базы данных тестовыми данными...');

    await seedUsers(dbService);
    await seedOrganizations(dbService);
    await seedDepartments(dbService);
    await seedPositions(dbService);
    await seedEmployees(dbService);
    await seedHrOperations(dbService);
    await seedFiles(dbService);

    console.log('База данных успешно заполнена тестовыми данными!');
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
    throw error;
  } finally {
    await dbService.onModuleDestroy();
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
} 