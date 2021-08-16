import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { PubSub } from "graphql-subscriptions";
import { buildASTSchema } from "graphql";
import { PrismaClient } from "@prisma/client";
import Mutation from "./resolvers/Mutation";
import Query from "./resolvers/Query";
import Author from "./resolvers/Author";
import Subscription from "./resolvers/Subscription";
import gql from "./schema";
const expressPlayground =
  require("graphql-playground-middleware-express").default;

const prisma = new PrismaClient();

const app = express();
app.set("port", 4000);
app.use(cors());

const pubsub = new PubSub();

const schema = buildASTSchema(gql);

const rootValue = {
  ...Query,
  ...Mutation,
  ...Author,
  ...Subscription,
};

app.use("/playground", expressPlayground({ endpoint: "/graphql" }));

app.get("/", async (req, res) => {
  const data = await prisma.users.findFirst({
    where: {
      email: "vic123@gmail.com	",
    },
  });
  console.log(data);
  res.status(200).json({
    success: false,
    path: req.body,
    message: "Page no found",
  });
});

app.use(
  "/graphql",
  graphqlHTTP((req) => {
    return {
      schema,
      rootValue,
      graphiql: true,
      context: {
        req,
        prisma,
        pubsub,
      },
    };
  })
);

const port = process.env.PORT || 4000;
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
export default app;
