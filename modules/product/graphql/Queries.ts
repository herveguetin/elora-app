export const PRODUCTS_BY_GIDS_QUERY =
  /* GraphQL */
  `
    query ($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          handle
          description
          featuredImage {
            url
          }
        }
      }
    }
  `;

export const METAFIELD_DEFINITIONS_LIST =
  /* GraphQL */
  `
    query MetafieldDefinitions($ownerType: MetafieldOwnerType!, $first: Int) {
      metafieldDefinitions(ownerType: $ownerType, first: $first) {
        nodes {
          id
          namespace
        }
      }
    }
  `;
