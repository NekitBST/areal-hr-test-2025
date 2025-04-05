import * as Joi from 'joi';

export const createChangeHistorySchema = Joi.object({
  changed_by: Joi.number().required()
    .messages({
      'number.base': 'ID пользователя должен быть числом',
      'any.required': 'ID пользователя обязателен'
    }),
  object_type: Joi.string().valid('organization', 'department', 'position', 'employee', 'hr_operation', 'file').required()
    .messages({
      'any.required': 'Тип объекта обязателен',
      'any.only': 'Недопустимый тип объекта'
    }),
  object_id: Joi.number().required()
    .messages({
      'number.base': 'ID объекта должен быть числом',
      'any.required': 'ID объекта обязателен'
    }),
  old_value: Joi.any().required()
    .messages({
      'any.required': 'Старое значение обязательно'
    }),
  new_value: Joi.any().required()
    .messages({
      'any.required': 'Новое значение обязательно'
    })
}); 