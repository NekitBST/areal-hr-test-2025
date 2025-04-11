import * as Joi from 'joi';

export const createFileSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Название файла не может быть пустым',
      'string.min': 'Название файла должно содержать минимум {#limit} символ',
      'string.max': 'Название файла не может быть длиннее {#limit} символов',
      'any.required': 'Название файла обязательно для заполнения'
    }),

  file_path: Joi.string(),

  employee_id: Joi.number()
    .required()
    .messages({
      'number.base': 'ID сотрудника должно быть числом и обязательно для заполнения (выберите из списка)',
      'any.required': 'ID сотрудника обязателен для заполнения'
    })
});

export const updateFileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Название файла не может быть пустым',
      'string.min': 'Название файла должно содержать минимум {#limit} символ',
      'string.max': 'Название файла не может быть длиннее {#limit} символов'
    }),

  file_path: Joi.string(),

  employee_id: Joi.number()
    .messages({
      'number.base': 'ID сотрудника должно быть числом и обязательно для заполнения (выберите из списка или оставьте выбранного)'
    }).min(1).messages({
      'object.min': 'Необходимо указать хотя бы одно поле для обновления'
    })
});