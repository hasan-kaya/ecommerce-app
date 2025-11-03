import { gql } from '@apollo/client';

export const GET_WALLET_TRANSACTIONS = gql`
  query GetWalletTransactions($currency: String!, $page: Int, $pageSize: Int) {
    walletTransactions(currency: $currency, page: $page, pageSize: $pageSize) {
      transactions {
        id
        type
        amountMinor
        currency
        description
        relatedTransactionId
        createdAt
      }
      total
      page
      pageSize
    }
  }
`;
