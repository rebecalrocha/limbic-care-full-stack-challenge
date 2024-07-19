import Question from "../question";
import Questionnaire from "../questionnaire";
import initDB from "@limbic-chatbot/src/config/initDB";
import { transaction } from "objection";

beforeAll(async () => initDB());

afterAll(async () => {
  await Question.query().delete();
  await Questionnaire.query().delete();
});

describe("Question Model", () => {
  test("Insert Question", async () => {
    await transaction(Questionnaire.knex(), async (trx) => {
      const questionnaireData = {
        name: "Standard Question Questionnaire",
        introMessage: "Welcome to the questionnaire!",
      };
      const questionnaire =
        await Questionnaire.query(trx).insert(questionnaireData);

      const questionData = {
        questionnaireId: questionnaire.id,
        label: "Question Label",
        name: "question_name",
      };
      const response = await Question.query(trx).insert(questionData);

      expect(response).toHaveProperty("id");
      expect(response.questionnaireId).toBe(questionData.questionnaireId);
      expect(response.label).toBe(questionData.label);
      expect(response.name).toBe(questionData.name);
    });
  });
});
