import { ApolloServer } from "apollo-server";
import {schema }from "./schema";
import { context } from "./context";
// import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";


export const server = new ApolloServer({
    schema,
    context,
    introspection: true, // Ensure this is set to true
});

const port = 3000;

server.listen({port}).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`); 
    // other logic here
})