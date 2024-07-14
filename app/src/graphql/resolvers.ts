import UserResponse from "../../db/models/userResponse";
import { v4 as uuid4 } from "uuid";

export const resolvers = {
  Mutation: {
    startQuestionnaire: async (_: unknown, { name }: { name: string }) => {
      try {
        const sessionId: string = uuid4();
        console.log("sessionId! updates ", sessionId);
        await UserResponse.query().insert({
          question: 0,
          answer: name,
          sessionId,
        });

        const welcomeMessage = `Nice to meet you, ${name}!`;
        const instructionsMessage = `For us to get started I will need to ask you some questions on how you've been feeling lately.`;
        const startMessage = `Shall we start?`;

        return {
          message: `${welcomeMessage}\n${instructionsMessage}\n${startMessage}`,
          sessionId,
        };
      } catch (error) {
        console.error("Error starting questionnaire:", error);
        throw new Error("Failed to start questionnaire");
      }
    },
    continueQuestionnaire: async (
      _: unknown,
      { sessionId, restart }: { sessionId: string; restart: boolean },
    ) => {
      try {
        if (restart) {
          await UserResponse.query().delete().where({ sessionId });
        }

        const restartMessage = `Hello, what's your name?`;
        const continueMessage = `Answer how often this happened in the last two weeks`;

        return {
          message: restart ? restartMessage : continueMessage,
          sessionId,
        };
      } catch (error) {
        console.error("Error continuing questionnaire:", error);
        throw new Error("Failed to continue questionnaire");
      }
    },
    answerQuestion: async (
      _: unknown,
      {
        sessionId,
        question,
        answer,
      }: { sessionId: string; question: number; answer: string },
    ) => {
      try {
        await UserResponse.query().insert({
          question,
          answer,
          sessionId,
        });

        const nextQuestionMessage = `Next question...`;

        return {
          message: nextQuestionMessage,
          sessionId,
        };
      } catch (error) {
        console.error("Error answering question:", error);
        throw new Error("Failed to answer question");
      }
    },
    finalizeQuestionnaire: async (
      _: unknown,
      { sessionId }: { sessionId: string },
    ) => {
      try {
        const finalMessage = `Thanks for answering!`;

        return {
          message: finalMessage,
          sessionId,
        };
      } catch (error) {
        console.error("Error finalizing questionnaire:", error);
        throw new Error("Failed to finalize questionnaire");
      }
    },
  },
};
