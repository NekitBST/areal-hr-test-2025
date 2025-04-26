import { DatabaseService } from '../common/services/database.service';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
  };
}

export function LogChanges(objectType: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const dbService = this.dbService as DatabaseService;
      const client = args[args.length - 1]?.query ? args[args.length - 1] : null;
      
      const request = args[0] as RequestWithUser;
      const userId = request?.user?.id;

      if (!userId) {
        throw new UnauthorizedException('User not authenticated');
      }
      
      const executeWithClient = async (transactionClient) => {
        let oldValue: Record<string, any> | null = null;

        if (propertyKey === 'update' || propertyKey === 'softDelete') {
          const id = args[1];
          const checkResult = await transactionClient.query(
            `SELECT * FROM ${objectType}s WHERE id = $1`,
            [id]
          );
          if (checkResult.rows.length > 0) {
            oldValue = checkResult.rows[0] as Record<string, any>;
          }
        }

        const result = await originalMethod.apply(this, client ? args : [...args, transactionClient]);
        
        let newValue: Record<string, any> = { ...result };
        
        if (propertyKey === 'create' || propertyKey === 'update') {
          const { deleted_at, ...rest } = newValue;
          newValue = rest;
          if (oldValue) {
            const { deleted_at: oldDeletedAt, ...oldRest } = oldValue;
            oldValue = oldRest;
          }
        }

        await transactionClient.query(
          `INSERT INTO change_history (
            changed_by,
            object_type,
            object_id,
            old_value,
            new_value,
            operation_time
          ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
          [
            userId,
            objectType,
            result.id,
            oldValue ? JSON.stringify(oldValue) : null,
            JSON.stringify(newValue),
          ]
        );

        return result;
      };

      if (client) {
        return executeWithClient(client);
      }

      return dbService.withTransaction(executeWithClient);
    };

    return descriptor;
  };
} 