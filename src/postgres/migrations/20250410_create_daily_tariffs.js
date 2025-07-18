/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    await knex.schema.createTable("daily_tariffs", (table) => {
        table.date("date").notNullable();
        table.string("warehouse_name").notNullable();
        table.decimal("delivery_base", 10, 2);
        table.decimal("storage_base", 10, 2);
        table.decimal("coefficient", 5, 2);
        table.timestamps(true, true);
        table.unique(["date", "warehouse_name"]);
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  return knex.schema.dropTable("daily_tariffs");
}
