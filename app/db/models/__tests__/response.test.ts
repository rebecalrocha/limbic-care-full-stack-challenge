import Response from "../response";
import Questionnaire from "../questionnaire";
import Question from "../question";
import initDB from "../../../src/config/initDB";

beforeAll(async () => initDB());

afterAll(async () => {
  await Response.query().delete();
  await Question.query().delete();
  await Questionnaire.query().delete();
});

describe("Response Model", () => {
  test("Insert Response", async () => {
    const questionnaireData = {
      name: "Standard Response Questionnaire",
      introMessage: "Welcome to the questionnaire!",
    };
    const questionnaire = await Questionnaire.query().insert(questionnaireData);

    const questionData = {
      questionnaireId: questionnaire.id,
      label: "question Label",
      name: "question_name",
    };
    const question = await Question.query().insert(questionData);

    const responseData = {
      questionId: question.id,
      value: 5,
    };

    const response = await Response.query().insert(responseData);

    expect(response).toHaveProperty("id");
    expect(response.questionId).toBe(responseData.questionId);
    expect(response.value).toBe(responseData.value);
  });
});
