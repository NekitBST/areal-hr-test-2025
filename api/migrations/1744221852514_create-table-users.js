exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    id: 'id',
    last_name: { type: 'varchar(255)', notNull: true },
    first_name: { type: 'varchar(255)', notNull: true },
    middle_name: { type: 'varchar(255)' },
    login: { 
      type: 'varchar(255)', 
      notNull: true,
      unique: true 
    },
    password_hash: { 
      type: 'text', 
      notNull: true
    },
    role_id: {
      type: 'integer',
      notNull: true,
      references: 'roles',
      onDelete: 'CASCADE'
    },
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

  pgm.createIndex('users', 'role_id');
};

exports.down = pgm => {
  pgm.dropTable('users');
}; 