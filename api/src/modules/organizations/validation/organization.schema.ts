import * as Joi from 'joi';

export const createOrganizationSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Название организации не может быть пустым',
      'string.min': 'Название организации должно содержать минимум {#limit} символа',
      'string.max': 'Название организации не может быть длиннее {#limit} символов',
      'any.required': 'Название организации обязательно для заполнения'
    }),
  comment: Joi.string()
    .allow('')
    .optional()
    .max(1000)
    .messages({
      'string.max': 'Комментарий не может быть длиннее {#limit} символов'
    })
});

export const updateOrganizationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Название организации не может быть пустым',
      'string.min': 'Название организации должно содержать минимум {#limit} символа',
      'string.max': 'Название организации не может быть длиннее {#limit} символов'
    }),
  comment: Joi.string()
    .allow('')
    .max(1000)
    .messages({
      'string.max': 'Комментарий не может быть длиннее {#limit} символов'
    })
}).min(1).messages({
  'object.min': 'Необходимо указать хотя бы одно поле для обновления'
});

export const findAllOrganizationsSchema = Joi.object({
  sortField: Joi.string().valid('id', 'name', 'comment', 'created_at', 'updated_at').default('id'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
}); 