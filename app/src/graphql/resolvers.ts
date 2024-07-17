import User from "../../db/models/user";
import Questionnaire from "../../db/models/questionnaire";
import Question from "../../db/models/question";
import QuestionnaireResponse from "../../db/models/questionnaireResponse";
import Response from "../../db/models/response";

export const resolvers = {
  Query: {
    getQuestionnaire: async (_: unknown, { name }: { name: string }) => {
      const questionnaire = await Questionnaire.query()
        .where("name", name)
        .withGraphFetched("[questions.[options]]")
        .first();

      if (!questionnaire) {
        throw new Error(`Questionnaire with name ${name} not found`);
      }

      return questionnaire;
    },
    getUserResponses: async (
      _: unknown,
      { userId, questionnaireId }: { userId: number; questionnaireId: number },
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
      { name, questionnaireName }: { name: string; questionnaireName: string },
    ) => {
      const questionnaire = await Questionnaire.query()
        .where("name", questionnaireName)
        .first();

      if (!questionnaire) {
        throw new Error(
          `Questionnaire with name ${questionnaireName} does not exist.`,
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
      },
    ) => {
      const questionnaireResponse =
        await QuestionnaireResponse.query().findById(questionnaireResponseId);

      if (!questionnaireResponse) {
        throw new Error(
          `Questionnaire Response with ID ${questionnaireResponseId} does not exist.`,
        );
      }

      const question = await Question.query().findById(questionId);
      if (
        !question ||
        question.questionnaireId !== questionnaireResponse.questionnaireId
      ) {
        throw new Error(
          `Question with ID ${questionId} does not belong to questionnaire with ID ${questionnaireResponse.questionnaireId}.`,
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
      { userId, questionnaireId }: { userId: number; questionnaireId: number },
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
          questionnaireResponse.id,
        );
      }

      return { userId };
    },
    updateUserInfo: async (
      _: unknown,
      { userId, userInfo }: { userId: number; userInfo: User },
    ) => {
      const userUpdateData = {
        phoneNumber: userInfo.phoneNumber,
        dateOfBirth: userInfo.dateOfBirth,
        email: userInfo.email,
        consentToPush: userInfo.consentToPush,
        consentToEmail: userInfo.consentToEmail,
        consentToCall: userInfo.consentToCall,
      };

      await User.query().findById(userId).update(userUpdateData);

      return { userId };
    },
  },
};
