import Questionnaire from "../questionnaire";
import knex from "../../../src/config/knex";

beforeAll(async () => {
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.migrate.rollback();
});

describe("Questionnaire Model", () => {
  test("Insert Questionnaire", async () => {
    const questionnaireData = {
      name: "Sample Questionnaire",
      introMessage: "Welcome to the questionnaire!",
    };

    const response = await Questionnaire.query().insert(questionnaireData);

    expect(response).toHaveProperty("id");
    expect(response.name).toBe(questionnaireData.name);
    expect(response.introMessage).toBe(questionnaireData.introMessage);
  });
});
