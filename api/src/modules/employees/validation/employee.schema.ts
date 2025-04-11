import * as Joi from 'joi';

export const createEmployeeSchema = Joi.object({
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
    .max(255)
    .messages({
      'string.max': 'Отчество не может быть длиннее {#limit} символов'
    }),
  
  date_of_birth: Joi.date()
    .required()
    .max('now')
    .messages({
      'date.base': 'Дата рождения должна быть действительной датой',
      'date.max': 'Дата рождения не может быть в будущем',
      'any.required': 'Дата рождения обязательна для заполнения'
    }),
  
  passport_series: Joi.string()
    .allow('')
    .max(4)
    .pattern(/^[0-9]*$/)
    .messages({
      'string.max': 'Серия паспорта не может быть длиннее {#limit} символов',
      'string.pattern.base': 'Серия паспорта должна содержать только цифры'
    }),
  
  passport_number: Joi.string()
    .allow('')
    .max(6)
    .pattern(/^[0-9]*$/)
    .messages({
      'string.max': 'Номер паспорта не может быть длиннее {#limit} символов',
      'string.pattern.base': 'Номер паспорта должен содержать только цифры'
    }),
  
  passport_issue_date: Joi.date()
    .allow(null)
    .max('now')
    .messages({
      'date.base': 'Дата выдачи паспорта должна быть действительной датой',
      'date.max': 'Дата выдачи паспорта не может быть в будущем'
    }),
  
  passport_department_code: Joi.string()
    .allow('')
    .max(10)
    .pattern(/^[0-9-]*$/)
    .messages({
      'string.max': 'Код подразделения не может быть длиннее {#limit} символов',
      'string.pattern.base': 'Код подразделения должен содержать только цифры и дефис'
    }),
  
  passport_issued_by: Joi.string()
    .allow('')
    .max(255)
    .messages({
      'string.max': 'Кем выдан паспорт не может быть длиннее {#limit} символов'
    }),
  
  registration_area: Joi.string()
    .allow('')
    .max(255)
    .messages({
      'string.max': 'Область/край/республика не может быть длиннее {#limit} символов'
    }),
  
  registration_city: Joi.string()
    .allow('')
    .max(255)
    .messages({
      'string.max': 'Город не может быть длиннее {#limit} символов'
    }),
  
  registration_street: Joi.string()
    .allow('')
    .max(255)
    .messages({
      'string.max': 'Улица не может быть длиннее {#limit} символов'
    }),
  
  registration_house: Joi.string()
    .allow('')
    .max(10)
    .messages({
      'string.max': 'Номер дома не может быть длиннее {#limit} символов'
    }),
  
  registration_building: Joi.string()
    .allow('')
    .max(10)
    .messages({
      'string.max': 'Корпус/строение не может быть длиннее {#limit} символов'
    }),
  
  registration_apartment: Joi.string()
    .allow('')
    .max(10)
    .messages({
      'string.max': 'Номер квартиры не может быть длиннее {#limit} символов'
    })
});

export const updateEmployeeSchema = Joi.object({
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
    .max(255)
    .messages({
      'string.max': 'Отчество не может быть длиннее {#limit} символов'
    }),
  
  date_of_birth: Joi.date()
    .max('now')
    .messages({
      'date.base': 'Дата рождения должна быть действительной датой',
      'date.max': 'Дата рождения не может быть в будущем'
    }),
  
  passport_series: Joi.string()
    .allow('')
    .max(4)
    .pattern(/^[0-9]*$/)
    .messages({
      'string.max': 'Серия паспорта не может быть длиннее {#limit} символов',
      'string.pattern.base': 'Серия паспорта должна содержать только цифры'
    }),
  
  passport_number: Joi.string()
    .allow('')
    .max(6)
    .pattern(/^[0-9]*$/)
    .messages({
      'string.max': 'Номер паспорта не может быть длиннее {#limit} символов',
      'string.pattern.base': 'Номер паспорта должен содержать только цифры'
    }),
  
  passport_issue_date: Joi.date()
    .allow(null)
    .max('now')
    .messages({
      'date.base': 'Дата выдачи паспорта должна быть действительной датой',
      'date.max': 'Дата выдачи паспорта не может быть в будущем'
    }),
  
  passport_department_code: Joi.string()
    .allow('')
    .max(10)
    .pattern(/^[0-9-]*$/)
    .messages({
      'string.max': 'Код подразделения не может быть длиннее {#limit} символов',
      'string.pattern.base': 'Код подразделения должен содержать только цифры и дефис'
    }),
  
  passport_issued_by: Joi.string()
    .allow('')
    .max(255)
    .messages({
      'string.max': 'Кем выдан паспорт не может быть длиннее {#limit} символов'
    }),
  
  registration_area: Joi.string()
    .allow('')
    .max(255)
    .messages({
      'string.max': 'Область/край/республика не может быть длиннее {#limit} символов'
    }),
  
  registration_city: Joi.string()
    .allow('')
    .max(255)
    .messages({
      'string.max': 'Город не может быть длиннее {#limit} символов'
    }),
  
  registration_street: Joi.string()
    .allow('')
    .max(255)
    .messages({
      'string.max': 'Улица не может быть длиннее {#limit} символов'
    }),
  
  registration_house: Joi.string()
    .allow('')
    .max(10)
    .messages({
      'string.max': 'Номер дома не может быть длиннее {#limit} символов'
    }),
  
  registration_building: Joi.string()
    .allow('')
    .max(10)
    .messages({
      'string.max': 'Корпус/строение не может быть длиннее {#limit} символов'
    }),
  
  registration_apartment: Joi.string()
    .allow('')
    .max(10)
    .messages({
      'string.max': 'Номер квартиры не может быть длиннее {#limit} символов'
    })
}).min(1).messages({
  'object.min': 'Необходимо указать хотя бы одно поле для обновления'
}); 