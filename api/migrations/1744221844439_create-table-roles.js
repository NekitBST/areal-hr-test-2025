exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('roles', {
    id: 'id',
    name: { 
      type: 'varchar(50)', 
      notNull: true,
      unique: true 
    }
  });

  pgm.sql(`
    INSERT INTO roles (name) VALUES 
    ('Администратор'),
    ('Менеджер по персоналу');
  `);
};

exports.down = pgm => {
  pgm.dropTable('roles');
}; 