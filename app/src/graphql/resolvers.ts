import User from "../../db/models/user";
import Response from "../../db/models/response";
import Question from "../../db/models/question";

export const resolvers = {
  Query: {
    getAllQuestions: async () => {
      const questions = await Question.query()
        .withGraphFetched("options")
        .orderBy("order");
      return questions;
    },
    getUserResponses: async (_: unknown, { userId }: { userId: number }) => {
      const userResponses = await Response.query()
        .select("questionId", "responseValue", "createdAt")
        .where("userId", userId);

      return userResponses;
    },
  },
  Mutation: {
    startQuestionnaire: async (_: unknown, { name }: { name: string }) => {
      const newUser = await User.query().insert({ name });

      const firstQuestion = await Question.query()
        .withGraphFetched("options")
        .orderBy("order")
        .first();

      return {
        userId: newUser.id,
        nextQuestionId: firstQuestion?.id,
        nextQuestionLabel: firstQuestion?.text,
        nextQuestionOptions: firstQuestion?.options,
      };
    },
    restartQuestionnaire: async (
      _: unknown,
      { userId }: { userId: number },
    ) => {
      await Response.query().delete().where("userId", userId);

      await User.query().deleteById(userId);

      const firstQuestion = await Question.query()
        .withGraphFetched("options")
        .orderBy("order")
        .first();

      return {
        userId,
        nextQuestionId: firstQuestion?.id,
        nextQuestionLabel: firstQuestion?.text,
        nextQuestionOptions: firstQuestion?.options,
      };
    },
    submitAnswer: async (
      _: unknown,
      {
        userId,
        questionId,
        responseValue,
      }: { userId: number; questionId: number; responseValue: string },
    ) => {
      const question = await Question.query().findById(questionId);
      if (!question) {
        throw new Error(`Question with ID ${questionId} was not found.`);
      }

      // TODO check if responseValue is a question option
      await Response.query().insert({
        userId,
        questionId,
        responseValue,
      });

      // TODO put in a service
      const getNextQuestion = (currentQuestionId: number, response: string) => {
        switch (currentQuestionId) {
          case 1:
            return response === "1" ? 3 : 2;
          case 2:
            return response === "0" ? 3 : 1;
          case 3:
          case 4:
          case 5:
            return currentQuestionId + 1;
          default:
            throw new Error(`Unexpected question ID: ${currentQuestionId}`);
        }
      };

      const nextQuestionId = getNextQuestion(questionId, responseValue);
      const nextQuestion = await Question.query()
        .findById(nextQuestionId)
        .withGraphFetched("options");

      return {
        userId,
        nextQuestionId: nextQuestion?.id,
        nextQuestionLabel: nextQuestion?.text,
        nextQuestionOptions: nextQuestion?.options,
      };
    },
  },
};
