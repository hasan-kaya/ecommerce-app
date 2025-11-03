export const walletTypeDefs = `#graphql
  type Wallet {
    id: ID!
    currency: String!
    balanceMinor: String!
    createdAt: String!
  }

  type WalletTransaction {
    id: ID!
    type: String!
    amountMinor: String!
    currency: String!
    description: String
    relatedTransactionId: String
    createdAt: String!
  }

  type WalletTransactionConnection {
    transactions: [WalletTransaction!]!
    total: Int!
    page: Int!
    pageSize: Int!
  }

  extend type Query {
    wallets: [Wallet!]!
    walletTransactions(
      currency: String!
      page: Int = 1
      pageSize: Int = 50
    ): WalletTransactionConnection!
  }

  type TransferResult {
    fromWallet: Wallet!
    toWallet: Wallet!
    convertedAmount: Int!
  }

  extend type Mutation {
    topUpWallet(currency: String!, amountMinor: Int!): Wallet!
    transferBetweenWallets(
      fromCurrency: String!
      toCurrency: String!
      amountMinor: Int!
    ): TransferResult!
  }
`;
