import Questionnaire from "../questionnaire";
import initDB from "../../../src/config/initDB";

beforeAll(() => initDB());

afterAll(async () => {
  await Questionnaire.query().delete();
});

describe("Questionnaire Model", () => {
  test("Insert Questionnaire", async () => {
    const questionnaireData = {
      name: "Standard Questionnaire",
      introMessage: "Welcome to the questionnaire!",
    };

    const response = await Questionnaire.query().insert(questionnaireData);

    expect(response).toHaveProperty("id");
    expect(response.name).toBe(questionnaireData.name);
    expect(response.introMessage).toBe(questionnaireData.introMessage);
  });
});
