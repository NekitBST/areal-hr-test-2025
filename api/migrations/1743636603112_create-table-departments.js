exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('departments', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    parent_id: { type: 'integer', references: 'departments' },
    organization_id: { 
      type: 'integer', 
      references: 'organizations',
      onDelete: 'CASCADE'
    },
    comment: { type: 'text' },
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

  pgm.createIndex('departments', 'organization_id');
  pgm.createIndex('departments', 'parent_id');
};

exports.down = pgm => {
  pgm.dropTable('departments');
};