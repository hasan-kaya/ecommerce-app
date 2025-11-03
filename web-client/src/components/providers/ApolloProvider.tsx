'use client';

import { ApolloProvider as ApolloClientProvider } from '@apollo/client/react';
import { getClientSideClient } from '@/lib/graphql/client';

const client = getClientSideClient();

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <ApolloClientProvider client={client}>{children}</ApolloClientProvider>;
}
