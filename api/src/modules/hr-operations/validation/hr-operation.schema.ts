import * as Joi from 'joi';

export const createHrOperationSchema = Joi.object({
  employee_id: Joi.number().required()
    .messages({
      'number.base': 'ID сотрудника должен быть числом и обязателен для заполнения (выберите из списка)',
      'any.required': 'ID сотрудника обязателен'
    }),
  department_id: Joi.number().required()
    .messages({
      'number.base': 'ID отдела должен быть числом и обязателен для заполнения (выберите из списка)',
      'any.required': 'ID отдела обязателен'
    }),
  position_id: Joi.number().required()
    .messages({
      'number.base': 'ID должности должен быть числом и обязателен для заполнения (выберите из списка)',
      'any.required': 'ID должности обязателен'
    }),
  salary: Joi.number().allow(null)
    .messages({
      'number.base': 'Зарплата должна быть числом'
    }),
  action: Joi.string().required()
    .messages({
      'any.required': 'Действие обязательно и не может быть пустым'
    })
});

export const updateHrOperationSchema = Joi.object({
  employee_id: Joi.number()
    .messages({
      'number.base': 'ID сотрудника должен быть числом и обязателен для заполнения (выберите из списка или оставьте выбранного)',
    }),
  department_id: Joi.number()
    .messages({
      'number.base': 'ID отдела должен быть числом и обязателен для заполнения (выберите из списка или оставьте выбранного)',
    }),
  position_id: Joi.number()
    .messages({
      'number.base': 'ID должности должен быть числом и обязателен для заполнения (выберите из списка или оставьте выбранного)',
    }),
  salary: Joi.number().allow(null)
    .messages({
      'number.base': 'Зарплата должна быть числом'
    }),
  action: Joi.string()
    .messages({
      'string.empty': 'Действие обязательно и не может быть пустым'
    })
}); 