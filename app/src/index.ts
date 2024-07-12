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
    createUserResponse(
      sessionId: String!
      question: Int!
      answer: String!
    ): UserResponse
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
