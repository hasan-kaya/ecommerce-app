import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($category: String, $search: String) {
    products(category: $category, search: $search) {
      id
      name
      slug
      priceMinor
      currency
      stockQty
      category {
        id
        name
        slug
      }
    }
  }
`;
