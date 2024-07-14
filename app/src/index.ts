import { ApolloServer, gql } from "apollo-server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers";
import Knex from "knex";
import { Model } from "objection";
import dotenv from "dotenv";

const knexConfig = require("../knexfile");
dotenv.config();

const environment = process.env.NODE_ENV || "development";
const configOptions = knexConfig[environment];
const knex = Knex(configOptions);
Model.knex(knex);

const typeDefs = gql`
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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
});

server.listen().then(({ url }) => {
  console.log(`🤖 Server ready at ${url}`);
});
