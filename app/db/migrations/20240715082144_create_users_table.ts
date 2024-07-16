import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.text("phoneNumber").nullable();
    table.date("dateOfBirth").nullable();
    table.text("email").nullable();
    table.boolean("consentToPush").defaultTo(false);
    table.boolean("consentToEmail").defaultTo(false);
    table.boolean("consentToCall").defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
