import { Wallet } from '@/entities/Wallet';
import { WalletTransaction } from '@/entities/WalletTransaction';
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
    walletTransactions: async (
      _: unknown,
      { currency, page, pageSize }: { currency: string; page?: number; pageSize?: number },
      context: GraphQLContext
    ) => {
      const userId = requireAuth(context);
      return walletService.getWalletTransactions(userId, currency, page, pageSize);
    },
  },
  Mutation: {
    topUpWallet: async (
      _: unknown,
      { currency, amountMinor }: { currency: string; amountMinor: number },
      context: GraphQLContext
    ) => {
      const userId = requireAuth(context);
      const wallet = await walletService.topUpUserWallet(userId, currency, amountMinor);
      return wallet;
    },
    transferBetweenWallets: async (
      _: unknown,
      {
        fromCurrency,
        toCurrency,
        amountMinor,
      }: { fromCurrency: string; toCurrency: string; amountMinor: number },
      context: GraphQLContext
    ) => {
      const userId = requireAuth(context);
      return await walletService.transferBetweenWallets(
        userId,
        fromCurrency,
        toCurrency,
        amountMinor
      );
    },
  },
  Wallet: {
    balanceMinor: (parent: Wallet) => parent.balance_minor.toString(),
    createdAt: (parent: Wallet) => parent.createdAt.toISOString(),
  },
  WalletTransaction: {
    createdAt: (parent: WalletTransaction) => parent.createdAt.toISOString(),
  },
};
