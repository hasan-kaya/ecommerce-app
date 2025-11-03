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
