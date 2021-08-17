import app from "./app";
import https from "https";
import fs from "fs";
import { execute, subscribe } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { config } from "dotenv";
import gql from "./schema";

config();
const options = {
  key: fs.readFileSync(process.env.SSL_KEY_FILE),
  cert: fs.readFileSync(process.env.SSL_CRT_FILE),
  requestCert: false,
  rejectUnauthorized: false,
};
const pubsub = new PubSub();
const server = https.createServer(options, app);

server.listen(app.get("port"), () => {
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema: gql,
    },
    {
      server: server,
      path: "/subscriptions",
    }
  );
  console.log(`App On port %s`, app.get("port"));
});
