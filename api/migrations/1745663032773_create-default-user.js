const argon2 = require('argon2');

exports.shorthands = undefined;

exports.up = async pgm => {
  const adminLogin = process.env.ADMIN_LOGIN;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const passwordHash = await argon2.hash(adminPassword, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4
  });

  pgm.sql(`
    DO $$ 
    DECLARE 
      admin_role_id integer;
    BEGIN
      SELECT id INTO admin_role_id FROM roles WHERE name = 'Администратор';
      
      INSERT INTO users (
        last_name,
        first_name,
        middle_name,
        login,
        password_hash,
        role_id,
        created_at,
        updated_at
      )
      SELECT
        'Admin',
        'Admin',
        NULL,
        '${adminLogin}',
        '${passwordHash}',
        admin_role_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      WHERE NOT EXISTS (
        SELECT 1 FROM users WHERE login = '${adminLogin}'
      );
    END $$;
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DELETE FROM users
    WHERE login = '${process.env.ADMIN_LOGIN }'
    AND EXISTS (
      SELECT 1 FROM roles r
      JOIN users u ON u.role_id = r.id
      WHERE r.name = 'Администратор'
      AND u.login = '${process.env.ADMIN_LOGIN}'
    );
  `);
}; 