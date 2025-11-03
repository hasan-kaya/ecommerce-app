import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const BACKEND_URL = process.env.BACKEND_URL || 'http://monolith-api:4000';
const PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// Client-side Apollo Client (browser)
export function getClientSideClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: `${PUBLIC_BACKEND_URL}/graphql`,
      credentials: 'include',
      fetchOptions: { cache: 'no-store' },
    }),
  });
}

// Server-side Apollo Client (SSR/Server Actions)
export async function getServerSideClient() {
  const { headers: getHeaders } = await import('next/headers');

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

export const getClient = getServerSideClient;
