# WB Tariff Tracker
Сервис для регулярного получения тарифов Wildberries 
и обновления данных в Google Sheets.

## Установка
```bash
git clone https://github.com/nikandjur/wb-tariff-tracker.git
cd wb-tariff-tracker
cp example.env .env
```

WB_API_TOKEN=your_wb_token

Положите JSON-ключ от Google Service Account в: 
```bash
credentials/service-account.json
```

тестовые таблицы  создать самостоятельно на Google Sheets, 
лист для тарифов назвать - stocks_coefs

ID Google Sheets таблиц вставить в 
```bash
src\postgres\seeds\spreadsheets.js
``` 
в значение ключа spreadsheet_id

Установите зависимости:
npm install

Запустите:
docker compose up

Смотреть логи:
docker logs -f app
