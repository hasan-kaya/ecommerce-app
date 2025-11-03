import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { headers as getHeaders } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://monolith-api:4000';

export async function getClient() {
  const headers: Record<string, string> = {};

  const headersList = await getHeaders();
  const sessionToken = headersList.get('x-session-token') || undefined;
  if (sessionToken) {
    headers.cookie = `session_token=${sessionToken}`;
  }

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: `${BACKEND_URL}/graphql`,
      headers,
      fetchOptions: { cache: 'no-store' },
    }),
  });
}
