import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("questionnaires", function (table) {
    table.increments("id").primary();
    table.text("name").notNullable().unique();
    table.text("introMessage").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("questionnaires");
}
