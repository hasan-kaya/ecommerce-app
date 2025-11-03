import { gql } from '@apollo/client';

export const TOP_UP_WALLET = gql`
  mutation TopUpWallet($currency: String!, $amountMinor: Int!) {
    topUpWallet(currency: $currency, amountMinor: $amountMinor) {
      id
      currency
      balanceMinor
      createdAt
    }
  }
`;

export const TRANSFER_BETWEEN_WALLETS = gql`
  mutation TransferBetweenWallets(
    $fromCurrency: String!
    $toCurrency: String!
    $amountMinor: Int!
  ) {
    transferBetweenWallets(
      fromCurrency: $fromCurrency
      toCurrency: $toCurrency
      amountMinor: $amountMinor
    ) {
      fromWallet {
        id
        currency
        balanceMinor
      }
      toWallet {
        id
        currency
        balanceMinor
      }
      convertedAmount
    }
  }
`;
