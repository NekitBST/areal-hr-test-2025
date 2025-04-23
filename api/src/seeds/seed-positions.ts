import { DatabaseService } from '../common/services/database.service';

export async function seedPositions(dbService: DatabaseService) {
  await dbService.query('TRUNCATE positions CASCADE');

  const positions = [
    { name: 'Ведущий разработчик' },
    { name: 'Frontend разработчик' },
    { name: 'Backend разработчик' },
    { name: 'QA инженер' }
  ];

  for (const position of positions) {
    await dbService.query(
      'INSERT INTO positions (name) VALUES ($1)',
      [position.name]
    );
  }

  console.log('Должности созданы');
} 