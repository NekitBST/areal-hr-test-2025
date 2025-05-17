# API маршруты

## Аутентификация

### POST /auth/login
Аутентификация пользователя

**Запрос:**
```json
{
  "login": "string",
  "password": "string"
}
```

**Ответ:**
```json
{
    "id": "number",
    "last_name": "string",
    "first_name": "string",
    "login": "string",
    "role_id": "number",
    "role_name": "string",
    "created_at": "date",
    "updated_at": "date",
}
```

### GET /auth/check
Проверка статуса аутентификации

**Ответ:**
```json
{
    "id": "number",
    "last_name": "string",
    "first_name": "string",
    "login": "string",
    "role_id": "number",
    "role_name": "string",
    "created_at": "date",
    "updated_at": "date",
}
```

### POST /auth/logout
Выход из системы

**Ответ:**
```json
{
  "message": "Выход выполнен успешно"
}
```

## Организации

### GET /organizations
Получение списка организаций

**Параметры запроса:**
- `sortField`: поле для сортировки
- `sortOrder`: порядок сортировки (ASC, DESC)

### GET /organizations/:id
Получение организации по ID

**Запрос:**
```
GET http://localhost:3000/api/organizations/id
```

**Ответ:**
```json
{
  "id": "number",
  "name": "string",
  "comment": "string",
  "created_at": "date",
  "updated_at": "date"
}
```

### POST /organizations
Создание организации

**Запрос:**
```json
{
  "name": "string",
  "comment": "string (optional)"
}
```

**Ответ:**
```json
{
  "id": "number",
  "name": "string",
  "comment": "string",
  "created_at": "date",
  "updated_at": "date"
}
```

### PUT /organizations/:id
Обновление организации _(Аналогично POST, но поля опциональны)_

### DELETE /organizations/:id
Удаление организации (мягкое удаление)

## Отделы

### GET /departments
Получение списка отделов

**Параметры запроса:**
- `sortField`: поле для сортировки
- `sortOrder`: порядок сортировки (ASC, DESC)

### GET /departments/:id
Получение отдела по ID

**Запрос:**
```
GET http://localhost:3000/api/departments/id
```

**Ответ:**
```json
{
  "id": "number",
  "name": "string",
  "organization_id": "number",
  "parent_id": "number",
  "comment": "string",
  "created_at": "date",
  "updated_at": "date"
}
```

### POST /departments
Создание отдела

**Запрос:**
```json
{
  "name": "string",
  "parent_id": "number (optional)",
  "organization_id": "number",
  "comment": "string (optional)"
}
```

**Ответ:**
```json
{
  "id": "number",
  "name": "string",
  "organization_id": "number",
  "parent_id": "number",
  "comment": "string",
  "created_at": "date",
  "updated_at": "date"
}
```

### PUT /departments/:id
Обновление отдела _(Аналогично POST, но поля опциональны)_

### DELETE /departments/:id
Удаление отдела (мягкое удаление)

## Должности

### GET /positions
Получение списка должностей

**Параметры запроса:**
- `sortField`: поле для сортировки
- `sortOrder`: порядок сортировки (ASC, DESC)

### GET /positions/:id
Получение должности по ID

**Запрос:**
```
GET http://localhost:3000/api/positions/id
```

**Ответ:**
```json
{
  "id": "number",
  "name": "string",
  "created_at": "date",
  "updated_at": "date"
}
```

### POST /positions
Создание должности

**Запрос:**
```json
{
  "name": "string"
}
```

**Ответ:**
```json
{
  "id": "number",
  "name": "string",
  "created_at": "date",
  "updated_at": "date"
}
```

### PUT /positions/:id
Обновление должности _(Аналогично POST, но поля опциональны)_

### DELETE /positions/:id
Удаление должности (мягкое удаление)

## Сотрудники

### GET /employees
Получение списка сотрудников

**Параметры запроса:**
- `sortField`: поле для сортировки
- `sortOrder`: порядок сортировки (ASC, DESC)

### GET /employees/:id
Получение сотрудника по ID

**Запрос:**
```
GET http://localhost:3000/api/employees/id
```

**Ответ:**
```json
{
  "id": "number",
  "last_name": "string",
  "first_name": "string",
  "middle_name": "string",
  "date_of_birth": "date",
  "passport_series": "string",
  "passport_number": "string",
  "passport_issue_date": "date",
  "passport_department_code": "string",
  "passport_issued_by": "string",
  "registration_area": "string",
  "registration_city": "string",
  "registration_street": "string",
  "registration_house": "string",
  "registration_building": "string",
  "registration_apartment": "string",
  "created_at": "date",
  "updated_at": "date",
  "department_name": "string",
  "position_name": "string",
  "salary": "number "
}
```

### POST /employees
Создание сотрудника

**Запрос:**
```json
{
  "last_name": "string",
  "first_name": "string",
  "middle_name": "string (optional)",
  "date_of_birth": "date",
  "passport_series": "string (optional)",
  "passport_number": "string (optional)",
  "passport_issue_date": "date (optional)",
  "passport_department_code": "string (optional)",
  "passport_issued_by": "string (optional)",
  "registration_area": "string (optional)",
  "registration_city": "string (optional)",
  "registration_street": "string (optional)",
  "registration_house": "string (optional)",
  "registration_building": "string (optional)",
  "registration_apartment": "string (optional)"
}
```

**Ответ:**
```json
{
  "id": "number",
  "last_name": "string",
  "first_name": "string",
  "middle_name": "string",
  "date_of_birth": "date",
  "passport_series": "string",
  "passport_number": "string",
  "passport_issue_date": "date",
  "passport_department_code": "string",
  "passport_issued_by": "string",
  "registration_area": "string",
  "registration_city": "string",
  "registration_street": "string",
  "registration_house": "string",
  "registration_building": "string",
  "registration_apartment": "string",
  "created_at": "date",
  "updated_at": "date"
}
```

### PUT /employees/:id
Обновление сотрудника _(Аналогично POST, но поля опциональны)_

### DELETE /employees/:id
Удаление сотрудника (мягкое удаление)

## HR-операции

### GET /hr-operations
Получение списка HR-операций

**Параметры запроса:**
- `sortField`: поле для сортировки
- `sortOrder`: порядок сортировки (ASC, DESC)

### GET /hr-operations/:id
Получение HR-операции по ID

**Запрос:**
```
GET http://localhost:3000/api/hr-operations/id
```

**Ответ:**
```json
{
  "id": "number",
  "employee_id": "number",
  "department_id": "number",
  "position_id": "number",
  "salary": "number",
  "action": "string",
  "action_date": "date",
  "created_at": "date",
  "updated_at": "date"
}
```

### POST /hr-operations
Создание HR-операции

**Запрос:**
```json
{
  "employee_id": "number",
  "department_id": "number",
  "position_id": "number",
  "salary": "number (optional)",
  "action": "string"
}
```

**Ответ:**
```json
{
  "id": "number",
  "employee_id": "number",
  "department_id": "number",
  "position_id": "number",
  "salary": "number",
  "action": "string",
  "action_date": "date",
  "created_at": "date",
  "updated_at": "date"
}
```

### PUT /hr-operations/:id
Обновление HR-операции _(Аналогично POST, но поля опциональны)_

### DELETE /hr-operations/:id
Удаление HR-операции (мягкое удаление)

## Файлы

### GET /files
Получение списка файлов

**Параметры запроса:**
- `sortField`: поле для сортировки
- `sortOrder`: порядок сортировки (ASC, DESC)

### GET /files/:id
Получение файла по ID

**Запрос:**
```
GET http://localhost:3000/api/files/id
```

**Ответ:**
```json
{
  "id": "number",
  "name": "string",
  "file_path": "string",
  "employee_id": "number",
  "created_at": "date",
  "updated_at": "date"
}
```

### POST /files
Загрузка файла

**Запрос:**
- Multipart form data с полем `file`

**Ответ:**
```json
{
  "id": "number",
  "name": "string",
  "file_path": "string",
  "employee_id": "number",
  "created_at": "date",
  "updated_at": "date"
}
```

### DELETE /files/:id
Удаление файла (мягкое удаление)

## Пользователи _(только для администраторов)_

### GET /users
Получение списка пользователей

**Параметры запроса:**
- `sortField`: поле для сортировки
- `sortOrder`: порядок сортировки (ASC, DESC)

### GET /users/:id
Получение пользователя по ID

**Запрос:**
```
GET http://localhost:3000/api/users/id
```

**Ответ:**
```json
{
  "id": "number",
  "last_name": "string",
  "first_name": "string",
  "middle_name": "string",
  "login": "string",
  "role_id": "number",
  "role_name": "string",
  "created_at": "date",
  "updated_at": "date"
}
```

### POST /users
Создание пользователя

**Запрос:**
```json
{
  "last_name": "string",
  "first_name": "string",
  "middle_name": "string (optional)",
  "login": "string",
  "password": "string",
  "role_id": "number"
}
```

**Ответ:**
```json
{
  "id": "number",
  "last_name": "string",
  "first_name": "string",
  "middle_name": "string",
  "login": "string",
  "role_id": "number",
  "created_at": "date",
  "updated_at": "date"
}
```

### PUT /users/:id
Обновление пользователя _(Аналогично POST, но поля опциональны)_

### DELETE /users/:id
Удаление пользователя (мягкое удаление)

## История изменений

### GET /change-history
Получение истории изменений

**Параметры запроса:**
- `sortField`: поле для сортировки
- `sortOrder`: порядок сортировки (ASC, DESC)

### GET /change-history/:id
Получение записи истории изменений по ID

**Запрос:**
```
GET http://localhost:3000/api/change-history/id
```

**Ответ:**
```json
{
  "id": "number",
  "table_name": "string",
  "record_id": "number",
  "action": "string",
  "old_values": "json",
  "new_values": "json",
  "user_id": "number",
  "created_at": "date"
}
```

## Коды ошибок

- `400` - Ошибка валидации или некорректный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера