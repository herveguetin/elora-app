export const CREATE_METAFIELD_DEFINITION =
  /* GraphQL */
  `
    mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

export const DELETE_METAFIELD_DEFINITION =
  /* GraphQL */
  `
    mutation DeleteMetafieldDefinition($id: ID!) {
      metafieldDefinitionDelete(id: $id) {
        deletedDefinitionId
        userErrors {
          field
          message
          code
        }
      }
    }
  `;
