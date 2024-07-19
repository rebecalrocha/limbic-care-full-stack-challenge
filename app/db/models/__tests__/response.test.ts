import Response from "../response";
import Questionnaire from "../questionnaire";
import Question from "../question";
import initDB from "@limbic-chatbot/src/config/initDB";
import { transaction } from "objection";

beforeAll(async () => initDB());

afterAll(async () => {
  await Response.query().delete();
  await Question.query().delete();
  await Questionnaire.query().delete();
});

describe("Response Model", () => {
  test("Insert Response", async () => {
    await transaction(Questionnaire.knex(), async (trx) => {
      const questionnaireData = {
        name: "Standard Response Questionnaire",
        introMessage: "Welcome to the questionnaire!",
      };
      const questionnaire =
        await Questionnaire.query(trx).insert(questionnaireData);

      const questionData = {
        questionnaireId: questionnaire.id,
        label: "Question Label",
        name: "question__response_name",
      };
      const question = await Question.query(trx).insert(questionData);

      const responseData = {
        questionId: question.id,
        value: 5,
      };

      const response = await Response.query(trx).insert(responseData);

      expect(response).toHaveProperty("id");
      expect(response.questionId).toBe(responseData.questionId);
      expect(response.value).toBe(responseData.value);
    });
  });
});
