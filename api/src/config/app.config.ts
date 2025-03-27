import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../../../.env') });

export const appConfig = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
};
