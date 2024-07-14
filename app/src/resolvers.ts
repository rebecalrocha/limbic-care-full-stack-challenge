import UserResponse from "./models/UserResponse";
import { v4 as uuidv4 } from "uuid";

export const resolvers = {
  Mutation: {
    startQuestionnaire: async (_: any, { name }: { name: string }) => {
      try {
        const sessionId: string = uuidv4();

        await UserResponse.query()
          .insert({
            question: 0,
            answer: name,
            sessionId,
          })
          .returning("*");

        const welcomeMessage = `Nice to meet you, ${name}!`;
        const instructionsMessage = `For us to get started I will need to ask you some questions on how you've been feeling lately.`;
        const startMessage = `Shall we start?`;

        return {
          message: `${welcomeMessage}\n${instructionsMessage}\n${startMessage}`,
        };
      } catch (error) {
        console.error("Error starting questionnaire:", error);
        throw new Error("Failed to start questionnaire");
      }
    },
  },
};
