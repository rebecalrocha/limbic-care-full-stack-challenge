import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("options", function (table) {
    table.increments("id").primary();
    table
      .integer("questionId")
      .unsigned()
      .references("id")
      .inTable("questions")
      .onDelete("CASCADE");
    table.text("label").notNullable();
    table.integer("value").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("options");
}
