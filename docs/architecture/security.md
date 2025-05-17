# Безопасность

## Аутентификация

### Сессионная аутентификация

Система использует сессионную аутентификацию на основе `express-session`:

```typescript
app.use(
  session({
    secret: appConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);
```

### Хранение паролей

- Пароли хранятся в виде хешей с использованием алгоритма Argon2
- Для каждого пароля генерируется уникальная соль
- Используется библиотека `argon2` для хеширования

### Стратегия аутентификации

- Использование Passport.js с локальной стратегией
- Поддержка сессий через PassportSerializer
- Проверка аутентификации через AuthenticatedGuard

## Авторизация

### Система ролей

В системе предусмотрены следующие роли:
- `Администратор` - полный доступ ко всем функциям
- `Менеджер по персоналу` - доступ к управлению сотрудниками, HR-операциям и т.д.

### Защита маршрутов

Защита маршрутов реализована с помощью:
- Guards в NestJS
- Декораторов для проверки ролей
- Middleware для проверки сессии

Пример защиты маршрута:

```typescript
@UseGuards(AuthenticatedGuard, RoleGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class EmployeesController {
  // ...
}
```

## Транзакционность

Все критические операции в системе выполняются в рамках транзакций для обеспечения целостности данных:

```typescript
async withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await this.getClient();
  this.logger.log('Начало транзакции');
  
  try {
    await client.query('BEGIN');
    this.logger.debug('Транзакция начата');
    
    const result = await callback(client);
    
    await client.query('COMMIT');
    this.logger.log('Транзакция успешно завершена');
    
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    this.logger.error(`Транзакция откачена: ${error.message}`);
    throw error;
  } finally {
    client.release();
    this.logger.debug('Клиент освобожден');
  }
}
```

## Валидация данных

### Входные данные
Система использует Joi для валидации входных данных:

```typescript
@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, {
      abortEarly: false,
      allowUnknown: false
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      throw new BadRequestException({
        message: 'Ошибка валидации',
        errors: errorMessages
      });
    }
    
    return value;
  }
}
```

## Безопасность файлов

### Хранение файлов
- Файлы хранятся в изолированной директории `files` вне корневой директории API
- Используются уникальные имена файлов с временной меткой и случайным числом
- Метаданные файлов хранятся в базе данных

### Загрузка файлов
- Строгое ограничение типов файлов (только .pdf, .jpg, .jpeg, .png)
- Проверка размера файла
- Транзакционная обработка загрузки (файл + запись в БД)
- Доступ только для авторизованных пользователей с ролью

## Защита от атак

### Сессионная безопасность
- Использование express-session с секретным ключом из переменных окружения
- Настроенное время жизни сессии (24 часа)
- Защита от CSRF через настройки CORS
- Сессии хранятся в памяти сервера

### Защита данных
- Параметризованные SQL запросы через pg-pool
- Валидация всех входных данных через Joi
- Типизация данных через TypeScript

### Авторизация
- Проверка прав доступа на уровне Guards
- Разграничение доступа по ролям
- Проверка сессии для каждого запроса

## Логирование и аудит

### Аудит действий
- Логирование всех важных операций через Logger
- Запись всех изменений в таблицу change_history
- Сохранение информации о пользователе при каждом действии

### История изменений
- Логирование изменений через декоратор @LogChanges
- Запись старых и новых значений
- Фиксация времени изменения
- Привязка к пользователю, выполнившему действие