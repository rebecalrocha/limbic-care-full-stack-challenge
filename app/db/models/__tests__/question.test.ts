import Question from "../question";
import Questionnaire from "../questionnaire";
import initDB from "../../../src/config/initDB";

beforeAll(() => initDB());

afterAll(async () => {
  await Question.query().delete();
  await Questionnaire.query().delete();
});

describe("Question Model", () => {
  test("Insert Question", async () => {
    const questionnaireData = {
      name: "Standard Question Questionnaire",
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
