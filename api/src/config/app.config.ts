import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../../../.env') });

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be defined in environment variables');
}

if (!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL must be defined in environment variables');
}

export const appConfig = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  frontendUrl: process.env.FRONTEND_URL,
  sessionSecret: process.env.SESSION_SECRET,
};
