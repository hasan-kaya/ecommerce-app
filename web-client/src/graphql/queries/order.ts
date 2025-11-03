import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
  query GetOrders($page: Int, $pageSize: Int) {
    orders(page: $page, pageSize: $pageSize) {
      orders {
        id
        priceMinor
        currency
        status
        createdAt
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
      }
      total
      page
      pageSize
    }
  }
`;
