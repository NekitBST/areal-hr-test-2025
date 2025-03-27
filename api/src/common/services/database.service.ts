import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import { databaseConfig } from '../../config/database.config';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(databaseConfig);
  }

  async query(sql: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(sql, params);
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}