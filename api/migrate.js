const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { execSync } = require('child_process');

const command = process.argv[2] || 'up';

const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Отсутствуют необходимые переменные среды:', missingVars.join(', '));
  console.error('Проверьте ваш файл .env');
  process.exit(1);
}

const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

try {
  execSync(`node-pg-migrate ${command}`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: connectionString
    }
  });
} catch (error) {
  console.error('Миграция не удалась:', error);
  process.exit(1);
} 
