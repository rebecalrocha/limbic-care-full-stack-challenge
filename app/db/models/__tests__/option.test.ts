import Option from "../option";
import Question from "../question";
import Questionnaire from "../questionnaire";
import initDB from "../../../src/config/initDB";

beforeAll(async () => initDB());

afterAll(async () => {
  await Option.query().delete();
  await Question.query().delete();
  await Questionnaire.query().delete();
});

describe("Option Model", () => {
  test("Insert Option", async () => {
    const questionnaireData = {
      name: "Standard Option Questionnaire",
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
