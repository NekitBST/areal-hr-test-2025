exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('files', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    file_path: { type: 'text', notNull: true },
    employee_id: {
      type: 'integer',
      references: 'employees',
      onDelete: 'CASCADE'
    },
    deleted: { type: 'boolean', default: false },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    update_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    deleted_at: { type: 'timestamp' },
  });
};

exports.down = pgm => {
  pgm.dropTable('files');
};
