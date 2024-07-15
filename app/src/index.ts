import { ApolloServer } from "apollo-server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./graphql/ schema";
import { resolvers } from "./graphql/resolvers";
import "./config/dotenv";
import "./config/knex";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
  formatError: (error) => {
    console.error("GraphQL error:", error);
    return error;
  },
});

server.listen().then(({ url }) => {
  console.log(`\n🤖 Server ready at ${url}\n`);
});
