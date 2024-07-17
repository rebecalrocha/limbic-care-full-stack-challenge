import type { Knex } from "knex";
import Questionnaire from "../models/questionnaire";
import Question from "../models/question";
import Option from "../models/option";

export async function seed(knex: Knex): Promise<void> {
  await knex(Option.tableName).del();
  await knex(Question.tableName).del();
  await knex(Questionnaire.tableName).del();

  const [{ id: questionnaireId }] = await knex(Questionnaire.tableName)
    .insert({
      name: "EmotionalWellbeingDialog",
      introMessage: "Answer how often this happened in the last two weeks.",
    })
    .returning("id");

  const questions = [
    {
      name: "interestOrPleasure",
      label: "Little interest or pleasure in doing things.",
    },
    { name: "feelingDown", label: "Feeling down, depressed, or hopeless." },
    {
      name: "troubleSleeping",
      label: "Trouble falling or staying asleep, or sleeping too much.",
    },
    { name: "feelingTired", label: "Feeling tired, or having little energy." },
    { name: "appetiteChanges", label: "Poor appetite or overeating." },
    {
      name: "selfEsteem",
      label:
        "Feeling bad about yourself or that you are a failure or have let yourself or your family down.",
    },
    {
      name: "concentrationTrouble",
      label:
        "Trouble concentrating on things, such as reading the newspaper or watching television.",
    },
    {
      name: "motorChanges",
      label:
        "Moving or speaking so slowly that other people could have noticed. Or the opposite being so fidgety or restless that you have been moving around a lot more than usual.",
    },
    {
      name: "selfHarmThoughts",
      label:
        "Thoughts that you would be better off dead, or of hurting yourself.",
    },
  ];

  const frequencyOptions = [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 },
  ];

  for (const question of questions) {
    const [{ id: questionId }] = await knex(Question.tableName)
      .insert({
        questionnaireId,
        name: question.name,
        label: question.label,
      })
      .returning("id");

    for (const option of frequencyOptions) {
      await knex(Option.tableName).insert({
        questionId,
        label: option.label,
        value: option.value,
      });
    }
  }

  const [{ id: questionId }] = await knex(Question.tableName)
    .insert({
      questionnaireId,
      name: "difficultyLevel",
      label:
        "How difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
    })
    .returning("id");

  const difficultyOptions = [
    { label: "Not difficult at all", value: 0 },
    { label: "Somewhat difficult", value: 1 },
    { label: "Very difficult", value: 2 },
    { label: "Extremely difficult", value: 3 },
  ];

  for (const option of difficultyOptions) {
    await knex(Option.tableName).insert({
      questionId,
      label: option.label,
      value: option.value,
    });
  }
}
