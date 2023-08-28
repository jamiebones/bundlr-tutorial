import { gql } from "@apollo/client";

export const GetUploadedImages = gql`
  query GetUploadedImages($tags: [TagFilter!]) {
    transactions(tags: $tags) {
      edges {
        node {
          timestamp
          address
          id
          tags {
            name
            value
          }
        }
      }
    }
  }
`;