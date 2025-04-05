exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('change_history', {
    id: 'id',
    operation_time: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    changed_by: {
      type: 'integer',
      references: 'users',
      onDelete: 'SET NULL'
    },
    object_type: {
      type: 'varchar(50)',
      notNull: true,
      check: "object_type IN ('organization', 'department', 'position', 'employee', 'hr_operation', 'file')"
    },
    object_id: { type: 'integer', notNull: true },
    old_value: { type: 'jsonb' },
    new_value: { type: 'jsonb' },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    }
  });
};

exports.down = pgm => {
  pgm.dropTable('change_history');
};
