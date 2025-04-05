import * as Joi from 'joi';

export const createFileSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(1)
    .max(255)
    .messages({
      'string.empty': 'Название файла не может быть пустым',
      'string.min': 'Название файла должно содержать минимум {#limit} символ',
      'string.max': 'Название файла не может быть длиннее {#limit} символов',
      'any.required': 'Название файла обязательно для заполнения'
    }),

  file_path: Joi.string()
    .required()
    .min(1)
    .max(1000)
    .messages({
      'string.empty': 'Путь к файлу не может быть пустым',
      'string.min': 'Путь к файлу должен содержать минимум {#limit} символ',
      'string.max': 'Путь к файлу не может быть длиннее {#limit} символов',
      'any.required': 'Путь к файлу обязателен для заполнения'
    }),

  employee_id: Joi.number()
    .required()
    .messages({
      'number.base': 'ID сотрудника должно быть числом',
      'any.required': 'ID сотрудника обязателен для заполнения'
    })
});

export const updateFileSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .messages({
      'string.empty': 'Название файла не может быть пустым',
      'string.min': 'Название файла должно содержать минимум {#limit} символ',
      'string.max': 'Название файла не может быть длиннее {#limit} символов'
    }),

  file_path: Joi.string()
    .min(1)
    .max(1000)
    .messages({
      'string.empty': 'Путь к файлу не может быть пустым',
      'string.min': 'Путь к файлу должен содержать минимум {#limit} символ',
      'string.max': 'Путь к файлу не может быть длиннее {#limit} символов'
    }),

  employee_id: Joi.number()
    .messages({
      'number.base': 'ID сотрудника должно быть числом'
    })
}).min(1).messages({
  'object.min': 'Необходимо указать хотя бы одно поле для обновления'
}); 