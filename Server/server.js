import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";

// const app = express();
// const server = new ApolloServer();

// app.listen(5500, () => {
//   console.log("Server Running successfully");
// });

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Test Route Running Successfully" });
// });

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs: `
    type Todo{
    id:ID!
    title:String!
    completed:Boolean!
    user:User
    }

    type User{
      name:String!
      id:ID!,
      username:String
      email:String
    }

    type Query{
      getAllTodos:[Todo]!,
      getAllUsers:[User]!,
      getUser(id:ID!):User
    }
    `,
    resolvers: {
      Todo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            )
          ).data,
      },
      Query: {
        getAllTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUser: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
      },
    },
  });

  // app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(5500, () => {
    console.log("Server Running Successfully on port 5500");
  });
};

startServer();
