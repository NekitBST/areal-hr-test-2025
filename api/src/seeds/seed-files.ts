import { DatabaseService } from '../common/services/database.service';
import * as fs from 'fs';
import * as path from 'path';

export async function seedFiles(dbService: DatabaseService) {
  await dbService.query('TRUNCATE files CASCADE');

  const filesDir = path.join(process.cwd(), 'files');
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
  }

  const employeesResult = await dbService.query('SELECT id FROM employees LIMIT 4');
  const employees = employeesResult.rows;

  const files = [
    {
      name: 'Трудовой договор.pdf',
      employee_id: employees[0].id,
      content: 'Тестовое содержимое трудового договора'
    },
    {
      name: 'Паспорт.pdf',
      employee_id: employees[1].id,
      content: 'Тестовое содержимое скана паспорта'
    },
    {
      name: 'СНИЛС.pdf',
      employee_id: employees[2].id,
      content: 'Тестовое содержимое скана СНИЛС'
    },
    {
      name: 'Диплом.pdf',
      employee_id: employees[3].id,
      content: 'Тестовое содержимое скана диплома'
    }
  ];

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(filesDir, fileName);
    fs.writeFileSync(filePath, file.content);

    await dbService.query(
      'INSERT INTO files (name, file_path, employee_id) VALUES ($1, $2, $3)',
      [file.name, fileName, file.employee_id]
    );
  }

  console.log('Файлы созданы');
} 