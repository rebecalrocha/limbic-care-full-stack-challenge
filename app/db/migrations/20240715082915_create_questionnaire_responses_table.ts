import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("questionnaire_responses", function (table) {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("questionnaireId")
      .unsigned()
      .references("id")
      .inTable("questionnaires")
      .onDelete("CASCADE");
    table.integer("totalValue").defaultTo(0);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("questionnaire_responses");
}
