import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    getUserResponses(name: String!): [UserResponse]
  }

  type Mutation {
    startQuestionnaire(name: String!): StartQuestionnaireResponse
    continueQuestionnaire(
      sessionId: String!
      restart: Boolean!
    ): ContinueQuestionnaireResponse
    answerQuestion(
      sessionId: String!
      question: Int!
      answer: String!
    ): AnswerQuestionResponse
    finalizeQuestionnaire(sessionId: String!): FinalizeQuestionnaireResponse
  }

  type UserResponse {
    id: ID!
    sessionId: String!
    question: Int!
    answer: String!
  }

  type StartQuestionnaireResponse {
    sessionId: String!
    message: String!
  }

  type ContinueQuestionnaireResponse {
    sessionId: String!
    message: String!
  }

  type AnswerQuestionResponse {
    sessionId: String!
    message: String!
  }

  type FinalizeQuestionnaireResponse {
    sessionId: String!
    message: String!
  }
`;

export {};
