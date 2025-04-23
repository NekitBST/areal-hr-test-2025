import { DatabaseService } from '../common/services/database.service';

export async function seedDepartments(dbService: DatabaseService) {
  await dbService.query('TRUNCATE departments CASCADE');

  const orgResult = await dbService.query(
    'SELECT id FROM organizations LIMIT 1'
  );
  const organizationId = orgResult.rows[0].id;

  const departments = [
    {
      name: 'Отдел разработки',
      organization_id: organizationId,
      parent_id: null,
      comment: 'Разработка программного обеспечения'
    },
    {
      name: 'Frontend отдел',
      organization_id: organizationId,
      parent_id: null,
      comment: 'Разработка пользовательских интерфейсов'
    },
    {
      name: 'Backend отдел',
      organization_id: organizationId,
      parent_id: null,
      comment: 'Разработка серверной части'
    },
    {
      name: 'QA отдел',
      organization_id: organizationId,
      parent_id: null,
      comment: 'Тестирование и контроль качества'
    }
  ];

  const departmentIds = {};
  
  for (const dept of departments) {
    const result = await dbService.query(
      'INSERT INTO departments (name, organization_id, parent_id, comment) VALUES ($1, $2, $3, $4) RETURNING id',
      [dept.name, dept.organization_id, dept.parent_id, dept.comment]
    );
    departmentIds[dept.name] = result.rows[0].id;
  }

  const parentId = departmentIds['Отдел разработки'];
  await dbService.query(
    'UPDATE departments SET parent_id = $1 WHERE name IN ($2, $3, $4)',
    [parentId, 'Frontend отдел', 'Backend отдел', 'QA отдел']
  );

  console.log('Отделы созданы');
} 