import QuestionnaireResponse from "../questionnaireResponse";
import Questionnaire from "../questionnaire";
import User from "../user";
import initDB from "@limbic-chatbot/src/config/initDB";
import { transaction } from "objection";

beforeAll(async () => initDB());

afterAll(async () => {
  await QuestionnaireResponse.query().delete();
  await User.query().delete();
  await Questionnaire.query().delete();
});

describe("Questionnaire Response Model", () => {
  test("Insert Questionnaire Response", async () => {
    await transaction(Questionnaire.knex(), async (trx) => {
      const questionnaireData = {
        name: "Standard Questionnaire Response Questionnaire",
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
      const response = await QuestionnaireResponse.query(trx).insert(
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
});
