exports.up = (pgm) => {
  const organizations = [
    {
      name: 'ООО "Технологии будущего"',
      comment: 'IT-компания, специализирующаяся на разработке ПО'
    },
    {
      name: 'АО "СтройПром"',
      comment: 'Строительная компания полного цикла'
    },
    {
      name: 'ООО "ЭкоПродукт"',
      comment: 'Производство экологически чистых продуктов питания'
    },
    {
      name: 'ЗАО "ФинансГрупп"',
      comment: 'Финансовый холдинг'
    }
  ];

  for (const org of organizations) {
    pgm.db.query(
      'INSERT INTO organizations (name, comment) VALUES ($1, $2)',
      [org.name, org.comment]
    );
  }
};

exports.down = (pgm) => {
  pgm.db.query('TRUNCATE organizations CASCADE');
};