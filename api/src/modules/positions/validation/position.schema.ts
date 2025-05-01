import * as Joi from 'joi';

export const createPositionSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Название должности не может быть пустым',
      'string.min': 'Название должности должно содержать минимум {#limit} символа',
      'string.max': 'Название должности не может быть длиннее {#limit} символов',
      'any.required': 'Название должности обязательно для заполнения'
    })
});

export const updatePositionSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Название должности не может быть пустым',
      'string.min': 'Название должности должно содержать минимум {#limit} символа',
      'string.max': 'Название должности не может быть длиннее {#limit} символов'
    })
}).min(1).messages({
  'object.min': 'Необходимо указать хотя бы одно поле для обновления'
});

export const findAllPositionsSchema = Joi.object({
  sortField: Joi.string().valid('id', 'name', 'created_at', 'updated_at').default('id'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
}); 