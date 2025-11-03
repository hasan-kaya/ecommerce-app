import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories($page: Int, $pageSize: Int) {
    categories(page: $page, pageSize: $pageSize) {
      categories {
        id
        name
        slug
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;
