export const CUSTOMER_QUERY =
  /* GraphQL */
  `
    query GetCustomer($id: ID!) {
      customer(id: $id) {
        email
      }
    }
  `;
