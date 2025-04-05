import * as Joi from 'joi';

export const createDepartmentSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Название отдела не может быть пустым',
      'string.min': 'Название отдела должно содержать минимум {#limit} символа',
      'string.max': 'Название отдела не может быть длиннее {#limit} символов',
      'any.required': 'Название отдела обязательно для заполнения'
    }),
  parent_id: Joi.number()
    .optional()
    .allow(null)
    .messages({
      'number.base': 'ID родительского отдела должно быть числом'
    }),
  organization_id: Joi.number()
    .required()
    .messages({
      'number.base': 'ID организации не может быть пустым (выберите из списка)',
      'any.required': 'ID организации обязательно для заполнения и должно быть числом'
    }),
  comment: Joi.string()
    .allow('')
    .optional()
    .max(1000)
    .messages({
      'string.max': 'Комментарий не может быть длиннее {#limit} символов'
    })
});

export const updateDepartmentSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Название отдела не может быть пустым',
      'string.min': 'Название отдела должно содержать минимум {#limit} символа',
      'string.max': 'Название отдела не может быть длиннее {#limit} символов'
    }),
  parent_id: Joi.number()
    .allow(null)
    .messages({
      'number.base': 'ID родительского отдела должно быть числом'
    }),
  organization_id: Joi.number()
    .messages({
      'number.base': 'ID организации не может быть пустым (выберите из списка или оставьте выбранную)'
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