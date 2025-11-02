import NextAuth from 'next-auth';
import type { OAuthConfig } from 'next-auth/providers/oauth';
import type { Session, Profile, Account, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

const BACKEND_URL = process.env.BACKEND_URL || 'http://monolith-api:4000';
const PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const webClientProvider = {
  id: 'web-client',
  name: 'Web Client',
  type: 'oauth',
  version: '2.0',
  clientId: 'web-client',
  issuer: `${PUBLIC_BACKEND_URL}/oidc`,
  authorization: {
    url: `${PUBLIC_BACKEND_URL}/oidc/auth`,
    params: {
      scope: 'openid profile email offline_access',
      response_type: 'code',
    },
  },
  token: {
    url: `${BACKEND_URL}/oidc/token`,
  },
  userinfo: {
    url: `${BACKEND_URL}/oidc/me`,
    request: async (context: { tokens: { access_token?: string } }) => {
      const response = await fetch(`${BACKEND_URL}/oidc/me`, {
        headers: {
          Authorization: `Bearer ${context.tokens.access_token}`,
        },
      });
      return await response.json();
    },
  },
  idToken: true,
  checks: ['pkce', 'state', 'nonce'],
  client: {
    token_endpoint_auth_method: 'none',
  },
  jwks_endpoint: `${BACKEND_URL}/oidc/jwks`,
  profile(profile: Profile & { sub: string; email: string; name?: string }) {
    return {
      id: profile.sub,
      email: profile.email,
      name: profile.name || profile.email,
    };
  },
};

export const authOptions = {
  debug: true,
  providers: [webClientProvider as OAuthConfig<Profile>],
  callbacks: {
    async jwt({
      token,
      account,
    }: {
      token: JWT;
      account: Account | null;
      user?: User;
    }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }

      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
};

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${BACKEND_URL}/oidc/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: 'web-client',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() / 1000 + refreshedTokens.expires_in,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
