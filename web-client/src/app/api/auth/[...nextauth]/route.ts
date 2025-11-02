import NextAuth from 'next-auth';

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
    request: async (context: any) => {
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
  profile(profile: any) {
    return {
      id: profile.sub,
      email: profile.email,
      name: profile.name || profile.email,
    };
  },
};

export const authOptions = {
  debug: true,
  providers: [webClientProvider],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
