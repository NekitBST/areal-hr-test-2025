exports.up = (pgm) => {
  const employees = [
    {
      last_name: 'Иванов',
      first_name: 'Иван',
      middle_name: 'Иванович',
      date_of_birth: '1985-03-15',
      passport_series: '4510',
      passport_number: '123456',
      passport_issue_date: '2010-04-20',
      passport_department_code: '770-001',
      passport_issued_by: 'УМВД России по г. Москве',
      registration_area: 'Московская область',
      registration_city: 'Москва',
      registration_street: 'Ленина',
      registration_house: '10',
      registration_building: '1',
      registration_apartment: '15'
    },
    {
      last_name: 'Петров',
      first_name: 'Петр',
      middle_name: 'Петрович',
      date_of_birth: '1990-07-22',
      passport_series: '4511',
      passport_number: '654321',
      passport_issue_date: '2015-08-15',
      passport_department_code: '770-002',
      passport_issued_by: 'УМВД России по г. Москве',
      registration_area: 'Московская область',
      registration_city: 'Химки',
      registration_street: 'Московская',
      registration_house: '5',
      registration_building: null,
      registration_apartment: '42'
    },
    {
      last_name: 'Сидорова',
      first_name: 'Анна',
      middle_name: 'Владимировна',
      date_of_birth: '1988-11-30',
      passport_series: '4512',
      passport_number: '987654',
      passport_issue_date: '2013-12-10',
      passport_department_code: '770-003',
      passport_issued_by: 'УМВД России по г. Москве',
      registration_area: 'Московская область',
      registration_city: 'Одинцово',
      registration_street: 'Советская',
      registration_house: '15',
      registration_building: '2',
      registration_apartment: '75'
    },
    {
      last_name: 'Козлов',
      first_name: 'Дмитрий',
      middle_name: 'Александрович',
      date_of_birth: '1992-04-05',
      passport_series: '4513',
      passport_number: '456789',
      passport_issue_date: '2017-05-20',
      passport_department_code: '770-004',
      passport_issued_by: 'УМВД России по г. Москве',
      registration_area: 'Московская область',
      registration_city: 'Мытищи',
      registration_street: 'Юбилейная',
      registration_house: '20',
      registration_building: null,
      registration_apartment: '89'
    }
  ];

  for (const employee of employees) {
    pgm.db.query(
      `INSERT INTO employees (
        last_name, first_name, middle_name, date_of_birth,
        passport_series, passport_number, passport_issue_date,
        passport_department_code, passport_issued_by,
        registration_area, registration_city, registration_street,
        registration_house, registration_building, registration_apartment
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        employee.last_name,
        employee.first_name,
        employee.middle_name,
        employee.date_of_birth,
        employee.passport_series,
        employee.passport_number,
        employee.passport_issue_date,
        employee.passport_department_code,
        employee.passport_issued_by,
        employee.registration_area,
        employee.registration_city,
        employee.registration_street,
        employee.registration_house,
        employee.registration_building,
        employee.registration_apartment
      ]
    );
  }
};

exports.down = (pgm) => {
  pgm.db.query('TRUNCATE employees CASCADE');
}; 