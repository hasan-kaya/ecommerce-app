import { gql } from '@apollo/client';

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $qty: Int!) {
    addToCart(productId: $productId, qty: $qty) {
      id
      qty
      product {
        id
        name
        priceMinor
        currency
      }
    }
  }
`;
