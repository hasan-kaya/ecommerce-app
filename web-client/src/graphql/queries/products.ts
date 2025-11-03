import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts(
    $category: String
    $search: String
    $page: Int
    $pageSize: Int
  ) {
    products(
      category: $category
      search: $search
      page: $page
      pageSize: $pageSize
    ) {
      products {
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
      total
      page
      pageSize
      totalPages
    }
  }
`;
