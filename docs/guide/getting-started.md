# Начало работы

## Установка

### Клонирование репозитория

```bash
git clone https://github.com/NekitBST/areal-hr-test-2025.git
cd areal-hr-test-2025
```

### Настройка переменных окружения

1. Cоздайте файл `.env` и скопируйте содержимое файла `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Отредактируйте файл `.env` и укажите необходимые параметры:

```env
# База данных
DB_USER=your_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000

# Режим разработки
VITE_DB_HOST=localhost
VITE_PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Секретный ключ
SESSION_SECRET=your-secret-key

# Учетные данные дефолтного администратора
ADMIN_LOGIN=your_admin_login
ADMIN_PASSWORD=your_admin_password
```

## Запуск в режиме разработки

### Backend (API)

```bash
cd api
npm install
npm run migrate:up
npm run start
```

### Frontend (App)

```bash
cd app
npm install
npm run dev
```
Backend часть приложения будет доступно по адресу: http://localhost:3000

Frontend часть приложения будет доступно по адресу: http://localhost:5173

## Запуск через Docker

1. Убедитесь, что Docker и Docker Compose установлены
2. Настройте переменные окружения для продакшн режима в `.env`:
```env
FRONTEND_URL=http://localhost
NODE_ENV=production
```
3. Запустите контейнеры:

```bash
docker-compose up
```

Приложение будет доступно по адресу: http://localhost

## Первый вход

1. Откройте приложение в браузере
2. Используйте учетные данные администратора из `.env`:
   - Логин: значение `ADMIN_LOGIN`
   - Пароль: значение `ADMIN_PASSWORD`

## Проверка работоспособности

После успешного входа вы должны увидеть:
- Панель навигации
- Заполненные данные в таблицах при помощи seed-миграций
- Возможность создавать новые записи
