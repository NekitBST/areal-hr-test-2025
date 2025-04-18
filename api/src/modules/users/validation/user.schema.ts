import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  last_name: Joi.string()
    .required()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Фамилия не может быть пустой',
      'string.min': 'Фамилия должна содержать минимум {#limit} символа',
      'string.max': 'Фамилия не может быть длиннее {#limit} символов',
      'any.required': 'Фамилия обязательна для заполнения'
    }),
  first_name: Joi.string()
    .required()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Имя не может быть пустым',
      'string.min': 'Имя должно содержать минимум {#limit} символа',
      'string.max': 'Имя не может быть длиннее {#limit} символов',
      'any.required': 'Имя обязательно для заполнения'
    }),
  middle_name: Joi.string()
    .allow('')
    .optional()
    .max(255)
    .messages({
      'string.max': 'Отчество не может быть длиннее {#limit} символов'
    }),
  login: Joi.string()
    .required()
    .min(3)
    .max(255)
    .messages({
      'string.empty': 'Логин не может быть пустым',
      'string.min': 'Логин должен содержать минимум {#limit} символа',
      'string.max': 'Логин не может быть длиннее {#limit} символов',
      'any.required': 'Логин обязателен для заполнения'
    }),
  password: Joi.string()
    .required()
    .min(6)
    .max(255)
    .messages({
      'string.empty': 'Пароль не может быть пустым',
      'string.min': 'Пароль должен содержать минимум {#limit} символов',
      'string.max': 'Пароль не может быть длиннее {#limit} символов',
      'any.required': 'Пароль обязателен для заполнения'
    }),
  role_id: Joi.number()
    .required()
    .messages({
      'number.base': 'Роль обязательна для заполнения (выберите роль из списка)',
      'any.required': 'Роль обязательна для заполнения'
    })
});

export const updateUserSchema = Joi.object({
  last_name: Joi.string()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Фамилия не может быть пустой',
      'string.min': 'Фамилия должна содержать минимум {#limit} символа',
      'string.max': 'Фамилия не может быть длиннее {#limit} символов'
    }),
  first_name: Joi.string()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Имя не может быть пустым',
      'string.min': 'Имя должно содержать минимум {#limit} символа',
      'string.max': 'Имя не может быть длиннее {#limit} символов'
    }),
  middle_name: Joi.string()
    .allow('')
    .optional()
    .max(255)
    .messages({
      'string.max': 'Отчество не может быть длиннее {#limit} символов'
    }),
  login: Joi.string()
    .min(3)
    .max(255)
    .messages({
      'string.empty': 'Логин не может быть пустым',
      'string.min': 'Логин должен содержать минимум {#limit} символа',
      'string.max': 'Логин не может быть длиннее {#limit} символов'
    }),
  password: Joi.string()
    .min(6)
    .max(255)
    .messages({
      'string.empty': 'Пароль не может быть пустым',
      'string.min': 'Пароль должен содержать минимум {#limit} символов',
      'string.max': 'Пароль не может быть длиннее {#limit} символов'
    }),
  role_id: Joi.number()
    .messages({
      'number.base': 'Роль не может быть пустой (выберите роль из списка или оставьте предыдущую)'
    })
}); 