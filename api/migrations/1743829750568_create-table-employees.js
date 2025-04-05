exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('employees', {
    id: 'id',
    last_name: { type: 'varchar(255)', notNull: true },
    first_name: { type: 'varchar(255)', notNull: true },
    middle_name: { type: 'varchar(255)' },
    date_of_birth: { type: 'date', notNull: true },
    passport_series: { type: 'varchar(20)' },
    passport_number: { type: 'varchar(20)' },
    passport_issue_date: { type: 'date' },
    passport_department_code: { type: 'varchar(10)' },
    passport_issued_by: { type: 'varchar(255)' },
    registration_area: { type: 'varchar(255)' },
    registration_city: { type: 'varchar(255)' },
    registration_street: { type: 'varchar(255)' },
    registration_house: { type: 'varchar(10)' },
    registration_building: { type: 'varchar(10)' },
    registration_apartment: { type: 'varchar(10)' },
    deleted: { type: 'boolean', default: false },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    deleted_at: { type: 'timestamp' },
  });
};

exports.down = pgm => {
  pgm.dropTable('employees');
};
