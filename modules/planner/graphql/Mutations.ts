export const CLEAR_CUSTOMER_PLANNER =
  /* GraphQL */
  `
    mutation ClearCustomerPlanner($metafields: [MetafieldIdentifierInput!]!) {
      metafieldsDelete(metafields: $metafields) {
        deletedMetafields {
          key
          namespace
          ownerId
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

export const SET_CUSTOMER_PLANNER =
  /* GraphQL */
  `
    mutation setCustomerPlanner($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

export const CREATE_REDIRECT =
  /* GraphQL */
  `
    mutation CreateUrlRedirect($path: String!, $target: String!) {
      urlRedirectCreate(urlRedirect: { path: $path, target: $target }) {
        urlRedirect {
          id
          path
          target
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
