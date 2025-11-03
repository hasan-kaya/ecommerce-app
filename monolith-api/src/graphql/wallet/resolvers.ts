import { Wallet } from '@/entities/Wallet';
import { GraphQLContext, requireAuth } from '@/graphql/utils/auth';
import { WalletService } from '@/services/WalletService';

const walletService = new WalletService();

export const walletResolvers = {
  Query: {
    wallets: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const userId = requireAuth(context);
      const wallets = await walletService.getUserWallets(userId);
      return wallets || [];
    },
  },
  Wallet: {
    balanceMinor: (parent: Wallet) => parent.balance_minor.toString(),
    createdAt: (parent: Wallet) => parent.createdAt.toISOString(),
  },
};
