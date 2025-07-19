import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// 1. HTTP link to your proxy or direct endpoint
const httpLink = new HttpLink({
  uri: 'http://localhost:1337/graphql',
});

// 2. Auth link to include your secret token (only on the server side)
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: `Bearer bd42874359116c4be0f0343c99eb669dfdb36b529f287a94c60374fa5b2bb918f542740c44d4630b39025411baf6fc132e0d2466bd499bb25f21f08173c8a826caea64923bcd67a3fffe8aa4683e87e17a940845ca6700306b72d02c0def645a226d2c04a4485758a45fe564b6dc6f81ca7987a9d01341b2bd40c5b439ec4954`,
  },
}));

// 3. Combine and create client
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
