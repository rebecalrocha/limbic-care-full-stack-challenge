import Response from "../response";
import knex from "../../../src/config/knex";
import QuestionnaireResponse from "../questionnaireResponse";
import Questionnaire from "../questionnaire";
import User from "../user";
import Question from "../question";

beforeAll(async () => {
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.migrate.rollback();
});

describe("Response Model", () => {
  test("Insert Response", async () => {
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
    const questionnaireResponse = await QuestionnaireResponse.query().insert(
      questionnaireResponseData,
    );

    const questionData = {
      questionnaireId: questionnaire.id,
      label: "question Label",
      name: "question_name",
    };
    const question = await Question.query().insert(questionData);

    const responseData = {
      questionnaireResponseId: questionnaireResponse.id,
      questionId: question.id,
      value: 5,
    };

    const response = await Response.query().insert(responseData);

    expect(response).toHaveProperty("id");
    expect(response.questionnaireResponseId).toBe(
      responseData.questionnaireResponseId,
    );
    expect(response.questionId).toBe(responseData.questionId);
    expect(response.value).toBe(responseData.value);
  });
});
