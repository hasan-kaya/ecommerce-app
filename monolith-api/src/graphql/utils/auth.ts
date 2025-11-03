import { Response } from 'express';
import { GraphQLError } from 'graphql';

export interface GraphQLContext {
  userId?: string;
  role?: string;
  scopes?: string[];
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

export const requireAdmin = (context: GraphQLContext): string => {
  const userId = requireAuth(context);
  if (context.role !== 'admin') {
    throw new GraphQLError('Forbidden: Admin access required', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
  return userId;
};

export const requireScope = (context: GraphQLContext, requiredScope: string): string => {
  const userId = requireAuth(context);
  const userScopes = context.scopes || [];

  if (!userScopes.includes(requiredScope)) {
    throw new GraphQLError(`Forbidden: Missing required scope '${requiredScope}'`, {
      extensions: { code: 'FORBIDDEN', requiredScope },
    });
  }

  return userId;
};

export const requireAnyScope = (context: GraphQLContext, requiredScopes: string[]): string => {
  const userId = requireAuth(context);
  const userScopes = context.scopes || [];

  const hasAnyScope = requiredScopes.some((scope) => userScopes.includes(scope));

  if (!hasAnyScope) {
    throw new GraphQLError(
      `Forbidden: Missing required scopes. Need one of: ${requiredScopes.join(', ')}`,
      {
        extensions: { code: 'FORBIDDEN', requiredScopes },
      }
    );
  }

  return userId;
};
