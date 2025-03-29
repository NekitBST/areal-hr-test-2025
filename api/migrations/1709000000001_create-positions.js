exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('positions', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
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
  pgm.dropTable('positions');
}; 