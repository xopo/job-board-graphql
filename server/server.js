import cors from "cors";
import { readFile } from "node:fs/promises";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { resolvers } from "./resolvers.js";
import { getUser } from "./db/users.js";

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);

const typeDefs = await readFile("./schema.graphql", "utf8", (error, data) => {
  if (error) {
    console.error({ error });
  }
  return data;
});

// console.log({ typeDefs, resolvers });

const apolloServer = new ApolloServer({ typeDefs, resolvers });

// authMiddleware will decode jwt and populate req.auth
const getContext = async ({ req: { auth } }) => {
  if (auth) {
    const user = await getUser(auth.sub);
    return { user };
  }
  return null;
};

await apolloServer.start();

app.use(
  "/graphql",
  apolloMiddleware(apolloServer, {
    context: getContext,
  }),
);

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL running on port ${PORT}/graphql`);
});
