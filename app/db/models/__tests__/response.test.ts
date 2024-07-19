import Response from "../response";
import Questionnaire from "../questionnaire";
import Question from "../question";
import initDB from "@limbic-chatbot/src/config/initDB";
import { transaction } from "objection";
import QuestionnaireResponse from "../questionnaireResponse";
import User from "../user";

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

      const name = "test-name";
      const user = await User.query(trx).insert({ name });

      const questionnaireResponseData = {
        userId: user.id,
        questionnaireId: questionnaire.id,
        totalValue: 10,
        createdAt: new Date().toISOString(),
      };
      const questionnaireResponse = await QuestionnaireResponse.query(
        trx,
      ).insert(questionnaireResponseData);

      const questionData = {
        questionnaireId: questionnaire.id,
        label: "Question Label",
        name: "question__response_name",
      };
      const question = await Question.query(trx).insert(questionData);

      const responseData = {
        questionnaireResponseId: questionnaireResponse.id,
        questionId: question.id,
        value: 5,
      };

      const response = await Response.query(trx).insert(responseData);

      expect(response).toHaveProperty("id");
      expect(response.questionnaireResponseId).toBe(
        responseData.questionnaireResponseId,
      );
      expect(response.questionId).toBe(responseData.questionId);
      expect(response.value).toBe(responseData.value);
    });
  });
});
