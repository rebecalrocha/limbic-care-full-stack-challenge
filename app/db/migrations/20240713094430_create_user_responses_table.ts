import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_responses", function (table) {
    table.increments("id").primary();
    table.text("answer");
    table.integer("question");
    table.text("sessionId");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user_responses");
}
