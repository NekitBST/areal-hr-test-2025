exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('hr_operations', {
    id: 'id',
    employee_id: {
      type: 'integer',
      references: 'employees',
      onDelete: 'CASCADE'
    },
    department_id: {
      type: 'integer',
      references: 'departments'
    },
    position_id: {
      type: 'integer',
      references: 'positions'
    },
    action_date: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    salary: { type: 'decimal(10,0)' },
    action: { type: 'text', notNull: true },
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
  pgm.dropTable('hr_operations');
};
