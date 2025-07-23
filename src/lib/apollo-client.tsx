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
    Authorization: `Bearer ${process.env.FSRF_BACKEND_TOKEN || '9000b94102da009d6e2788b4f6bedd92228317ea126a99c4a7be91e1a63a8b94981e5a609674c715abecb70090277d4d65b632d8d944a849bd18b2e11ae73ba47e24db10a32b6832fe28df6809bbdf72953c225812729a25dc7e0b25f958591125d1735850a999554b8855ef702ec39eb26df3f803cfa896ed7f781fbd8a8bcc'}`,
  },
}));

// 3. Combine and create client
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
