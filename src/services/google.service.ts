import { google } from 'googleapis';
import knex from '#postgres/knex.js';

// для запуска приложения в режиме разработки dev
// const GOOGLE_CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH_DEV; 

const GOOGLE_CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH; // prod

const auth = new google.auth.GoogleAuth({
  keyFile: GOOGLE_CREDENTIALS_PATH,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function updateGoogleSheets() {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetIds = await knex('spreadsheets').pluck('spreadsheet_id');
  const tariffs = await knex('daily_tariffs')
    .select('*')
    .orderBy('coefficient', 'asc');

  if (tariffs.length === 0 || spreadsheetIds.length === 0) {
    console.warn('No data to update in Google Sheets');
    return;
  }

  const values = [
    ['Склад', 'Коэффициент', 'Доставка (база)', 'Хранение (база)', 'Дата'],
    ...tariffs.map(t => [
      t.warehouse_name,
      t.coefficient,
      t.delivery_base,
      t.storage_base,
      t.date,
    ]),
  ];

  for (const spreadsheetId of spreadsheetIds) {
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'stocks_coefs!A1',
        valueInputOption: 'RAW',
        requestBody: { values },
      });
      console.log(`Updated sheet: ${spreadsheetId}`);
    } catch (error) {
      console.error(`Failed to update ${spreadsheetId}:`, error instanceof Error ? error.message : error);
    }
  }
}