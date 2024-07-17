import Question from "../question";
import knex from "../../../src/config/knex";
import Questionnaire from "../questionnaire";

beforeAll(async () => {
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.migrate.rollback();
});

describe("Question Model", () => {
  test("Insert Question", async () => {
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
    const response = await Question.query().insert(questionData);

    expect(response).toHaveProperty("id");
    expect(response.questionnaireId).toBe(questionData.questionnaireId);
    expect(response.label).toBe(questionData.label);
    expect(response.name).toBe(questionData.name);
  });
});
