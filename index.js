
const { createServer } = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const { ApolloServer } = require("apollo-server-express");

const express = require("express");

const jwt = require("jsonwebtoken");

const typeDefs = require("./typedefs");

const resolvers = require("./resolvers");

const User = require("./models/User");

require('./mongo')

const app = express();

const httpServer = createServer(app);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const subsServer = SubscriptionServer.create(
  { schema, execute, subscribe },
  { server: httpServer, path: "/graphql" }
);

const JWT_SECRET = "Diablo_que_dura_la_chamaquita";

const server = new ApolloServer({
  schema,
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            subsServer.close();  },
        };  },
     },
  ],
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLocaleLowerCase().startsWith("bearer ")) {
      const token = auth.substring(7);
      const { id } = jwt.verify(token, JWT_SECRET);
      const currentUser = await User.findById(id).populate("friends");
      return { currentUser };
    }
  },
});


 server.start()
.then(() => server.applyMiddleware({ app }));


    const PORT = 4000;

    httpServer.listen(PORT, () => {
    console.log(`server is now running on port ${PORT}`);
    });


