import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    getAllQuestions: [Question]
    getUserResponses(userId: Int!): [UserResponse]
  }

  type Mutation {
    startQuestionnaire(name: String!): QuestionnaireResponse
    restartQuestionnaire(userId: Int!): QuestionnaireResponse
    submitAnswer(
      userId: Int!
      questionId: Int!
      responseValue: String!
    ): QuestionnaireResponse
  }

  type Question {
    id: Int!
    text: String!
    order: Int!
    options: [Option]
  }

  type UserResponse {
    questionId: Int!
    responseValue: String!
    createdAt: String!
  }

  type QuestionnaireResponse {
    userId: Int!
    nextQuestionId: Int
    nextQuestionLabel: String
    nextQuestionOptions: [Option]
  }

  type Option {
    id: Int!
    questionId: Int!
    label: String!
    value: Int
  }
`;

export {};
