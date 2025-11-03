import { gql } from '@apollo/client';

export const CHECKOUT = gql`
  mutation Checkout($walletCurrency: String!) {
    checkout(walletCurrency: $walletCurrency) {
      id
      priceMinor
      currency
      status
      items {
        id
        product {
          id
          name
        }
        qty
        priceMinor
        currency
      }
      createdAt
    }
  }
`;
