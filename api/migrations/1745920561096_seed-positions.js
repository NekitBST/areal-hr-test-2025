exports.up = (pgm) => {
  const positions = [
    { name: 'Ведущий разработчик' },
    { name: 'Frontend разработчик' },
    { name: 'Backend разработчик' },
    { name: 'QA инженер' }
  ];

  for (const position of positions) {
    pgm.db.query(
      'INSERT INTO positions (name) VALUES ($1)',
      [position.name]
    );
  }
};

exports.down = (pgm) => {
  pgm.db.query('TRUNCATE positions CASCADE');
}; 