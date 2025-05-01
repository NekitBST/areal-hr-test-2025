import * as Joi from 'joi';

export const findAllChangeHistorySchema = Joi.object({
  sortField: Joi.string().valid(
    'id', 'operation_time', 'created_at', 'changed_by', 'object_type', 'object_id'
  ).default('id'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
}); 