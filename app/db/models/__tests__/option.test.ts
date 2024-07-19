import Option from "../option";
import Question from "../question";
import Questionnaire from "../questionnaire";
import initDB from "@limbic-chatbot/src/config/initDB";
import { transaction } from "objection";

beforeAll(async () => initDB());

afterAll(async () => {
  await Option.query().delete();
  await Question.query().delete();
  await Questionnaire.query().delete();
});

describe("Option Model", () => {
  test("Insert Option", async () => {
    await transaction(Questionnaire.knex(), async (trx) => {
      const questionnaireData = {
        name: "Standard Option Questionnaire",
        introMessage: "Welcome to the questionnaire!",
      };
      const questionnaire =
        await Questionnaire.query(trx).insert(questionnaireData);

      const questionData = {
        questionnaireId: questionnaire.id,
        label: "Question Label",
        name: "question__option_name",
      };
      const question = await Question.query(trx).insert(questionData);

      const optionData = {
        questionId: question.id,
        label: "option_label",
        value: 1,
      };
      const response = await Option.query(trx).insert(optionData);

      expect(response).toHaveProperty("id");
      expect(response.questionId).toBe(optionData.questionId);
      expect(response.label).toBe(optionData.label);
      expect(response.value).toBe(optionData.value);
    });
  });
});
