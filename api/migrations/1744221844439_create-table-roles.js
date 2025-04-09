exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('roles', {
    id: 'id',
    name: { 
      type: 'varchar(50)', 
      notNull: true,
      unique: true 
    },
    access_level: { 
      type: 'integer',
      notNull: true 
    }
  });
};

exports.down = pgm => {
  pgm.dropTable('roles');
}; 