import { DatabaseService } from '../common/services/database.service';

export async function seedHrOperations(dbService: DatabaseService) {
  await dbService.query('TRUNCATE hr_operations CASCADE');

  const employeesResult = await dbService.query('SELECT id FROM employees LIMIT 4');
  const departmentsResult = await dbService.query('SELECT id FROM departments LIMIT 4');
  const positionsResult = await dbService.query('SELECT id FROM positions LIMIT 4');

  const employees = employeesResult.rows;
  const departments = departmentsResult.rows;
  const positions = positionsResult.rows;

  const hrOperations = [
    {
      employee_id: employees[0].id,
      department_id: departments[0].id,
      position_id: positions[0].id,
      salary: 150000,
      action: 'Прием на работу',
      action_date: '2023-01-15'
    },
    {
      employee_id: employees[1].id,
      department_id: departments[1].id,
      position_id: positions[1].id,
      salary: 120000,
      action: 'Прием на работу',
      action_date: '2023-02-01'
    },
    {
      employee_id: employees[2].id,
      department_id: departments[2].id,
      position_id: positions[2].id,
      salary: 130000,
      action: 'Прием на работу',
      action_date: '2023-03-10'
    },
    {
      employee_id: employees[3].id,
      department_id: departments[3].id,
      position_id: positions[3].id,
      salary: 100000,
      action: 'Прием на работу',
      action_date: '2023-04-20'
    }
  ];

  for (const operation of hrOperations) {
    await dbService.query(
      `INSERT INTO hr_operations (
        employee_id, department_id, position_id,
        salary, action, action_date
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        operation.employee_id,
        operation.department_id,
        operation.position_id,
        operation.salary,
        operation.action,
        operation.action_date
      ]
    );
  }

  console.log('HR операции созданы');
} 