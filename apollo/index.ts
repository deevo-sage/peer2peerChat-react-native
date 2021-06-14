import { ApolloClient, DefaultOptions, InMemoryCache, HttpLink, split } from "@apollo/client"
import { } from "apollo-link-http"
import { ApolloLink } from "apollo-link";
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from "subscriptions-transport-ws";

const wsLink = new WebSocketLink(new SubscriptionClient(
    'ws://192.168.29.55:4000/subs',
    {
        lazy: true,
        reconnect: true
    }
));

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value

const httplink = new HttpLink({ uri: "http://192.168.29.55:4000" });
const subscriptionlink = new HttpLink({ uri: "http://192.168.29.55:4000/subscription" });

const cache = new InMemoryCache({

});
const defaultOptions: DefaultOptions = {

    watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
    },
    query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
    },

};

const authlink = new ApolloLink((operation, next) => {
    return next(operation);
});
const link = authlink.concat(httplink);
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httplink,
);
const client = new ApolloClient({
    link: splitLink,
    cache,
    defaultOptions
});
export const subsciptionclient = new ApolloClient({
    link: subscriptionlink,
    cache,
    defaultOptions
});

export default client;
