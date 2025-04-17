import { DatabaseService } from '../common/services/database.service';

export function LogChanges(objectType: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const dbService = this.dbService as DatabaseService;
      
      return dbService.withTransaction(async (client) => {
        let oldValue: Record<string, any> | null = null;

        if (propertyKey === 'update' || propertyKey === 'softDelete') {
          const id = args[0];
          const checkResult = await client.query(
            `SELECT * FROM ${objectType}s WHERE id = $1`,
            [id]
          );
          if (checkResult.rows.length > 0) {
            oldValue = checkResult.rows[0] as Record<string, any>;
          }
        }

        const result = await originalMethod.apply(this, args);
        
        let newValue: Record<string, any> = { ...result };
        
        if (propertyKey === 'create' || propertyKey === 'update') {
          const { deleted_at, ...rest } = newValue;
          newValue = rest;
          if (oldValue) {
            const { deleted_at: oldDeletedAt, ...oldRest } = oldValue;
            oldValue = oldRest;
          }
        }

        const userId = 1; // хардкодим будет пока что по умолчанию id юзера 1
        await client.query(
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
      });
    };

    return descriptor;
  };
} 