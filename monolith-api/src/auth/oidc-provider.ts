import { ClientAuthMethod, Provider, ResponseType } from 'oidc-provider';

import { RedisAdapter } from './oidc-redis-adapter';

import { AppDataSource } from '@/config/data-source';
import { User } from '@/entities/User';

const oidcIssuer = process.env.OIDC_ISSUER || 'http://localhost:4000/oidc';

const configuration = {
  adapter: RedisAdapter,
  clients: [
    {
      client_id: 'web-client',
      grant_types: ['refresh_token', 'authorization_code'],
      redirect_uris: [
        process.env.OIDC_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/web-client',
      ],
      token_endpoint_auth_method: 'none' as ClientAuthMethod,
      response_types: ['code' as ResponseType],
    },
  ],
  cookies: {
    keys: ['some-secret-key-for-dev'],
  },
  claims: {
    openid: ['sub'],
    email: ['email'],
    profile: ['name'],
  },
  interactions: {
    url(ctx: any, interaction: any) {
      return `/interaction/${interaction.uid}`;
    },
  },
  findAccount: async (ctx: any, id: string) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: id } });

    if (!user) {
      return undefined;
    }

    return {
      accountId: id,
      async claims(_use: any, _scope: any) {
        return {
          sub: user.id,
          email: user.email,
          name: user.name,
        };
      },
    };
  },
  pkce: {
    required: () => false,
  },
  features: {
    devInteractions: { enabled: false },
  },
};

export const oidc = new Provider(oidcIssuer, configuration);
