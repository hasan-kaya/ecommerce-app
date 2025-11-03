export const walletTypeDefs = `#graphql
  type Wallet {
    id: ID!
    currency: String!
    balanceMinor: String!
    createdAt: String!
  }

  extend type Query {
    wallets: [Wallet!]!
  }
`;
