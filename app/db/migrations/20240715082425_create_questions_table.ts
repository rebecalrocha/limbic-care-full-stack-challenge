import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("questions", function (table) {
    table.increments("id").primary();
    table.text("text").notNullable();
    table.integer("order").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("questions");
}
