import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("responses", function (table) {
    table.increments("id").primary();
    table
      .integer("questionnaireResponseId")
      .unsigned()
      .references("id")
      .inTable("questionnaire_responses")
      .onDelete("CASCADE");
    table
      .integer("questionId")
      .unsigned()
      .references("id")
      .inTable("questions")
      .onDelete("CASCADE");
    table.integer("value").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("responses");
}
