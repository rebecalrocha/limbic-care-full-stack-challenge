import Option from "../option";
import Question from "../question";
import knex from "../../../src/config/knex";
import Questionnaire from "../questionnaire";

beforeAll(async () => {
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.migrate.rollback();
});

describe("Option Model", () => {
  test("Insert Option", async () => {
    const questionnaireData = {
      name: "Sample Questionnaire",
      introMessage: "Welcome to the questionnaire!",
    };
    const questionnaire = await Questionnaire.query().insert(questionnaireData);

    const questionData = {
      questionnaireId: questionnaire.id,
      label: "question Label",
      name: "question_name",
    };
    const question = await Question.query().insert(questionData);

    const optionData = {
      questionId: question.id,
      label: "option_label",
      value: 1,
    };
    const response = await Option.query().insert(optionData);

    expect(response).toHaveProperty("id");
    expect(response.questionId).toBe(optionData.questionId);
    expect(response.label).toBe(optionData.label);
    expect(response.value).toBe(optionData.value);
  });
});
