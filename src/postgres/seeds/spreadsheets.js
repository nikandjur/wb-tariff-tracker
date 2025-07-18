/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */


export async function seed(knex) {
    // Таблица с ID Google Sheets
    await knex("spreadsheets")
        .insert([
            { spreadsheet_id: "13qr0Et3v2t2YG4TMyXsQlXnF_Hpkm1chVSWnzE8FCIE" }, // Замените на свои ID
            { spreadsheet_id: "1BiigAWakR2_GAYmMcQHWp8cEtKTfS1eJVJ86a02cR3s" }, // Замените на свои ID
        ])
        .onConflict("spreadsheet_id")
        .ignore();

    // Тестовые тарифы (опционально)
    // await knex("daily_tariffs").insert([
    //     /* ... */
    // ]);
}