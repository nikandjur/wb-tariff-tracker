import { migrate, seed } from "#postgres/knex.js";
import { fetchWBTariffs } from "./services/wb.service.js";
import { saveTariffsToDB } from "./services/tariff.service.js";
import { updateGoogleSheets } from "./services/google.service.js";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

async function updateTariffsAndSheets() {
    console.log("Fetching tariffs from WB...");
    const tariffs = await fetchWBTariffs();
    if (tariffs.length > 0) {
        await saveTariffsToDB(tariffs);
        await updateGoogleSheets();
    } else {
        console.warn("No tariffs received from API");
    }
}

async function main() {
    // 1. Инициализация БД
    await migrate.latest();
    await seed.run();

    // 2. Задача: обновление данных каждый час
    cron.schedule("0 * * * *", updateTariffsAndSheets);

    // 3. Первый запуск сразу при старте
    console.log("Service started");
    await updateTariffsAndSheets(); // Вызываем сразу при старте
}

main().catch(console.error);
