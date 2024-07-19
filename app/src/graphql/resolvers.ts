import User from "@limbic-chatbot/db/models/user";
import Questionnaire from "@limbic-chatbot/db/models/questionnaire";
import Question from "@limbic-chatbot/db/models/question";
import QuestionnaireResponse from "@limbic-chatbot/db/models/questionnaireResponse";
import Response from "@limbic-chatbot/db/models/response";

export interface UserInfo {
  name: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  email?: string;
  consentToPush?: boolean;
  consentToEmail?: boolean;
  consentToCall?: boolean;
}

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
        .withGraphFetched("[questionnaire.[questions.[responses]]]")
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
        userId,
        questionId,
        value,
      }: {
        userId: number;
        questionId: number;
        value: number;
      },
    ) => {
      const question = await Question.query().findById(questionId);

      if (!question) {
        throw new Error(`Question with ID ${questionId} not found.`);
      }

      const questionnaireResponse = await QuestionnaireResponse.query()
        .where("userId", userId)
        .andWhere("questionnaireId", question.questionnaireId)
        .first();

      if (!questionnaireResponse) {
        throw new Error(
          `Question Response with user ID ${userId} and questionnaire ID ${question.questionnaireId} not found.`,
        );
      }

      const response = await Response.query().insert({
        questionId,
        value,
      });

      await QuestionnaireResponse.query()
        .patch({ totalValue: questionnaireResponse.totalValue + value })
        .findById(questionnaireResponse.id);

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

        await User.query().deleteById(userId);
      }

      return { userId };
    },
    updateUserInfo: async (
      _: unknown,
      { userId, userInfo }: { userId: number; userInfo: UserInfo },
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
