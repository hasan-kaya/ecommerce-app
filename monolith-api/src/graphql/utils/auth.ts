import { Response } from 'express';
import { GraphQLError } from 'graphql';

export interface GraphQLContext {
  userId?: string;
  res?: Response;
}

export const requireAuth = (context: GraphQLContext): string => {
  if (!context.userId) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.userId;
};
