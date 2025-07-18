import knex from "#postgres/knex.js";
import { WBTariff } from "#types/index.js";

export async function saveTariffsToDB(tariffs: WBTariff[]) {
    if (!tariffs.length) {
        console.warn("No tariffs to save");
        return [];
    }

    try {
        const result = await knex("daily_tariffs")
            .insert(
                tariffs.map((t) => ({
                    date: t.date,
                    warehouse_name: t.warehouseName,
                    delivery_base: t.deliveryBase,
                    storage_base: t.storageBase,
                    coefficient: t.coefficient,
                    updated_at: knex.fn.now(),
                })),
            )
            .onConflict(["date", "warehouse_name"])
            .merge(["delivery_base", "storage_base", "coefficient", "updated_at"])
            .returning("*");

        console.log(`Saved ${result.length} tariff records`);
        return result;
    } catch (error) {
        console.error("Failed to save tariffs:", error);
        throw error;
    }
}