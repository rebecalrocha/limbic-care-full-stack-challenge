import type { Knex } from "knex";
import Question from "../models/question";

export async function seed(knex: Knex): Promise<void> {
  await knex(Question.tableName).del();

  await knex(Question.tableName).insert([
    {
      id: 1,
      text: "For us to get started I will need to ask you some questions on how you've been feeling lately.\nShall we start?",
      order: 1,
    },
    {
      id: 2,
      text: "No worries, need free to come back to this anytime.",
      order: 2,
    },
    {
      id: 3,
      text: "Answer how often this happened in the last two weeks.\nLittle interest or pleasure in doing things.",
      order: 3,
    },
    {
      id: 4,
      text: "Feeling down, depressed, or hopeless.",
      order: 4,
    },
    {
      id: 5,
      text: "Trouble failing or staying asleep, or sleeping too much.",
      order: 5,
    },
  ]);
}
