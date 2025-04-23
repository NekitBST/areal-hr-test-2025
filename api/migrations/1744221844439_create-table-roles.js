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
};

exports.down = pgm => {
  pgm.dropTable('roles');
}; 