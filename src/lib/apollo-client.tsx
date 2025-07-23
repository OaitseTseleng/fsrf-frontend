import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// 1. HTTP link to your proxy or direct endpoint
const httpLink = new HttpLink({
  uri: 'http://13.218.95.118:1337/graphql',
});

// 2. Auth link to include your secret token (only on the server side)
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: `Bearer ${process.env.FSRF_BACKEND_TOKEN || '313f122d227a4b4a6d1e637b64c654cb2aa66007aed538f2aa6395277f963684f49566bac094dd143f263da75e0c1cd7903dc505032e99b92d050d08fbe8907c802fe27e0cef06f6cbcbddd26a3b7fa6bedb24af7d19da5a2295e3b5ce4a3d9325550cd79eb0254ce9d599e7adba376c415215ca213c0cb29eef05e065a614ff'}`,
  },
}));

// 3. Combine and create client
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
