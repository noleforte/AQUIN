# Локальная настройка для тестирования

## Шаг 1: Настройка локального API сервера

1. **Перейдите в папку local-api:**
   ```bash
   cd "aquin-main WEB/local-api"
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте переменную окружения:**
   - Создайте файл `.env` в папке `local-api`
   - Добавьте ваш OpenAI API ключ:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Запустите локальный сервер:**
   ```bash
   npm start
   ```
   
   Сервер запустится на `http://localhost:5501`

## Шаг 2: Запуск фронтенда

1. **Откройте ваш HTML файл:**
   - Откройте `aquin-main WEB/aquin-main/index.html` в браузере
   - Или используйте Live Server в VS Code

2. **Тестирование:**
   - Попробуйте отправить сообщение в чате
   - Чат должен работать с локальным API сервером

## Шаг 3: Проверка работы

### Проверка API сервера:
```bash
# Проверка health endpoint
curl http://localhost:5501/api/health

# Тест чата
curl -X POST http://localhost:5501/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"message":"Hello","isUser":true}]}'
```

### Проверка в браузере:
- Откройте `test-vercel-api.html` и нажмите "Test API"
- Или используйте основной `index.html`

## Структура файлов

```
aquin-main WEB/
├── local-api/
│   ├── chat.js          # Локальный API сервер
│   └── package.json     # Зависимости
├── aquin-main/
│   └── index.html       # Основной файл (обновлен)
├── test-vercel-api.html # Тест API
└── LOCAL_SETUP.md       # Эта инструкция
```

## Возможные проблемы

### Ошибка "OpenAI API key not configured"
- Убедитесь, что файл `.env` создан в папке `local-api`
- Проверьте, что переменная `OPENAI_API_KEY` правильно установлена

### Ошибка "Cannot find module"
- Убедитесь, что вы выполнили `npm install` в папке `local-api`

### Ошибка CORS
- Локальный сервер настроен для работы с CORS
- Если проблема остается, проверьте настройки в `chat.js`

### Ошибка "Connection refused"
- Убедитесь, что локальный сервер запущен на порту 5501
- Проверьте, что порт не занят другим процессом

## Переключение между локальным и продакшн

Код автоматически определяет окружение:

- **Локальная разработка** (`localhost:5500`) → использует `localhost:5501/api/chat`
- **Продакшн** (Vercel) → использует `/api/chat`

## Следующие шаги

После успешного локального тестирования:

1. **Разверните на Vercel** используя `vercel-api/chat.js`
2. **Настройте переменные окружения** в Vercel Dashboard
3. **Протестируйте продакшн версию** 