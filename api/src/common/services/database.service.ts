import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import { databaseConfig } from '../../config/database.config';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    this.pool = new Pool(databaseConfig);
  }

  async query(sql: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(sql, params);
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    this.logger.log('Начало транзакции');
    
    try {
      await client.query('BEGIN');
      this.logger.debug('Транзакция начата');
      
      const result = await callback(client);
      
      await client.query('COMMIT');
      this.logger.log('Транзакция успешно завершена');
      
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error(`Транзакция откачена: ${error.message}`);
      throw error;
    } finally {
      client.release();
      this.logger.debug('Клиент освобожден');
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}