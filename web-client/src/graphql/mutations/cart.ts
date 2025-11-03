import { gql } from '@apollo/client';

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $qty: Int!) {
    addToCart(productId: $productId, qty: $qty) {
      id
      totalPrice
      cartItems {
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
  }
`;

export const UPDATE_CART_ITEM_QUANTITY = gql`
  mutation UpdateCartItemQuantity($cartItemId: ID!, $qty: Int!) {
    updateCartItemQuantity(cartItemId: $cartItemId, qty: $qty) {
      id
      totalPrice
      cartItems {
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
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($cartItemId: ID!) {
    removeCartItem(cartItemId: $cartItemId) {
      id
      totalPrice
      cartItems {
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
  }
`;
