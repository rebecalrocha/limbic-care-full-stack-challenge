import QuestionnaireResponse from "../questionnaireResponse";
import knex from "../../../src/config/knex";
import Questionnaire from "../questionnaire";
import Question from "../question";
import User from "../user";

beforeAll(async () => {
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.migrate.rollback();
});

describe("QuestionnaireResponse Model", () => {
  test("Insert QuestionnaireResponse", async () => {
    const questionnaireData = {
      name: "Sample Questionnaire",
      introMessage: "Welcome to the questionnaire!",
    };
    const questionnaire = await Questionnaire.query().insert(questionnaireData);

    const name = "test-name";
    const user = await User.query().insert({ name });

    const questionnaireResponseData = {
      userId: user.id,
      questionnaireId: questionnaire.id,
      totalValue: 10,
      createdAt: new Date().toISOString(),
    };
    const response = await QuestionnaireResponse.query().insert(
      questionnaireResponseData,
    );

    expect(response).toHaveProperty("id");
    expect(response.userId).toBe(questionnaireResponseData.userId);
    expect(response.questionnaireId).toBe(
      questionnaireResponseData.questionnaireId,
    );
    expect(response.totalValue).toBe(questionnaireResponseData.totalValue);
    expect(response.createdAt).toBe(questionnaireResponseData.createdAt);
  });
});
