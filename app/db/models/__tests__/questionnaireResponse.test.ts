import QuestionnaireResponse from "../questionnaireResponse";
import Questionnaire from "../questionnaire";
import User from "../user";
import initDB from "../../../src/config/initDB";

beforeAll(async () => initDB());

afterAll(async () => {
  await Questionnaire.query().delete();
  await QuestionnaireResponse.query().delete();
});

describe("Questionnaire Response Model", () => {
  test("Insert Questionnaire Response", async () => {
    const questionnaireData = {
      name: "Standard Questionnaire Response Questionnaire",
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
