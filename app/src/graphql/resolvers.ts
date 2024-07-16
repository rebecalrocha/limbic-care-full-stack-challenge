import User from "../../db/models/user";
import Questionnaire from "../../db/models/questionnaire";
import Question from "../../db/models/question";
import QuestionnaireResponse from "../../db/models/questionnaireResponse";
import Response from "../../db/models/response";
import { Transaction } from "objection";

export const resolvers = {
  Query: {
    getQuestionnaires: async (_: unknown) => {
      const questionnaires = await Questionnaire.query().withGraphFetched(
        "[questions.[options]]"
      );

      return questionnaires;
    },
    getUserResponses: async (
      _: unknown,
      { userId, questionnaireId }: { userId: number; questionnaireId: number }
    ) => {
      const userResponses = await QuestionnaireResponse.query()
        .where("userId", userId)
        .andWhere("questionnaireId", questionnaireId)
        .withGraphFetched("responses")
        .first();

      return userResponses;
    },
  },
  Mutation: {
    startQuestionnaire: async (
      _: unknown,
      { name, questionnaireId }: { name: string; questionnaireId: number }
    ) => {
      const questionnaire =
        await Questionnaire.query().findById(questionnaireId);

      if (!questionnaire) {
        throw new Error(
          `Questionnaire with ID ${questionnaireId} does not exist.`
        );
      }

      const user = await User.query().insert({ name });

      const questionnaireResponse = await QuestionnaireResponse.query().insert({
        userId: user.id,
        questionnaireId: questionnaire.id,
      });

      return {
        userId: user.id,
        questionnaireResponseId: questionnaireResponse.id,
      };
    },
    submitAnswer: async (
      _: unknown,
      {
        questionnaireResponseId,
        questionId,
        value,
      }: {
        questionnaireResponseId: number;
        questionId: number;
        value: number;
      }
    ) => {
      const questionnaireResponse =
        await QuestionnaireResponse.query().findById(questionnaireResponseId);

      if (!questionnaireResponse) {
        throw new Error(
          `Questionnaire Response with ID ${questionnaireResponseId} does not exist.`
        );
      }

      const question = await Question.query().findById(questionId);
      if (
        !question ||
        question.questionnaireId !== questionnaireResponse.questionnaireId
      ) {
        throw new Error(
          `Question with ID ${questionId} does not belong to questionnaire with ID ${questionnaireResponse.questionnaireId}.`
        );
      }

      const response = await Response.query().insert({
        questionnaireResponseId: questionnaireResponse.id,
        questionId,
        value,
      });

      await QuestionnaireResponse.query()
        .patch({ totalValue: questionnaireResponse.totalValue + value })
        .findById(questionnaireResponseId);

      return response;
    },
    resetQuestionnaire: async (
      _: unknown,
      { userId, questionnaireId }: { userId: number; questionnaireId: number }
    ) => {
      const questionnaireResponse = await QuestionnaireResponse.query()
        .where("userId", userId)
        .andWhere("questionnaireId", questionnaireId)
        .first();

      if (questionnaireResponse) {
        await Response.query()
          .delete()
          .where("questionnaireResponseId", questionnaireResponse.id);

        await QuestionnaireResponse.query().deleteById(
          questionnaireResponse.id
        );
      }

      return { userId };
    },
  },
};
