import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export function getClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_URL ||
        'http://monolith-api:4000/graphql',
      fetchOptions: { cache: 'no-store' }, // SSR için cache'i disable et
    }),
  });
}
