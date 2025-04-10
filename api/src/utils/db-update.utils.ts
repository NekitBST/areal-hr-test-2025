import { isUndefined } from 'lodash';

export interface UpdateQueryBuilder {
  updateFields: string[];
  values: any[];
  valueIndex: number;
}

export function buildUpdateQuery<T extends object>(
  dto: T,
  initialValueIndex: number = 1
): UpdateQueryBuilder {
  const builder: UpdateQueryBuilder = {
    updateFields: [],
    values: [],
    valueIndex: initialValueIndex,
  };

  Object.entries(dto).forEach(([key, value]) => {
    if (!isUndefined(value)) {
      builder.updateFields.push(`${key} = $${builder.valueIndex}`);
      builder.values.push(value);
      builder.valueIndex++;
    }
  });

  return builder;
} 