import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("questions", function (table) {
    table.increments("id").primary();
    table
      .integer("questionnaireId")
      .unsigned()
      .references("id")
      .inTable("questionnaires")
      .onDelete("CASCADE");
    table.text("name").notNullable().unique();
    table.text("label").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("questions");
}
