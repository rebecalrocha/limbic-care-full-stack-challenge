import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    getQuestionnaire(name: String!): Questionnaire
    getUserResponses(userId: Int!, questionnaireId: Int!): QuestionnaireResponse
  }

  type Mutation {
    startQuestionnaire(
      name: String!
      questionnaireName: String!
    ): StartQuestionnaireResponse
    submitAnswer(userId: Int!, questionId: Int!, value: Int!): Response
    resetQuestionnaire(userId: Int!, questionnaireId: Int!): UserIdResponse
    updateUserInfo(userId: Int!, userInfo: User!): UserIdResponse
  }

  type StartQuestionnaireResponse {
    userId: Int!
    questionnaireResponseId: Int!
  }

  type UserIdResponse {
    userId: Int!
  }

  type Option {
    id: Int!
    label: String!
    value: Int
  }

  type QuestionnaireResponse {
    id: Int!
    userId: Int!
    questionnaireId: Int!
    totalValue: Int!
    createdAt: String!
    questionnaire: Questionnaire
  }

  type Questionnaire {
    id: Int!
    name: String!
    introMessage: String
    questions: [Question]
  }

  type Question {
    id: Int!
    name: String!
    label: String!
    options: [Option]
    responses: [Response]
  }

  type Response {
    questionId: Int!
    value: Int!
  }

  input User {
    phoneNumber: String
    dateOfBirth: String
    email: String
    consentToPush: Boolean
    consentToEmail: Boolean
    consentToCall: Boolean
  }
`;

export {};
