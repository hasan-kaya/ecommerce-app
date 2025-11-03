import { gql } from '@apollo/client';

export const GET_CART = gql`
  query GetCart {
    cart {
      id
      totalPrice
      cartItems {
        id
        qty
        product {
          id
          name
          slug
          priceMinor
          currency
          stockQty
        }
      }
    }
  }
`;
