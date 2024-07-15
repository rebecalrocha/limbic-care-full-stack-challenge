import type { Knex } from "knex";
import Option from "../models/option";

const frequencyOptions = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

export async function seed(knex: Knex): Promise<void> {
  await knex(Option.tableName).del();

  await knex(Option.tableName).insert([
    { questionId: 1, label: "Yes", value: 1 },
    { questionId: 1, label: "No", value: 0 },
    { questionId: 2, label: "I want to restart", value: 1 },
    { questionId: 2, label: "Let's continue", value: 0 },
    ...frequencyOptions.map((option) => ({ questionId: 3, ...option })),
    ...frequencyOptions.map((option) => ({ questionId: 4, ...option })),
    ...frequencyOptions.map((option) => ({ questionId: 5, ...option })),
  ]);
}
