export const PLANNER_QUERY =
  /* GraphQL */
  `
    query GetPlanner($id: ID!) {
      metaobject(id: $id) {
        fields {
          key
          value
        }
      }
    }
  `;

export const ALL_PLANNERS_QUERY =
  /* GraphQL */
  `
    query GetPlanners($type: String!) {
      metaobjects(first: 250, type: $type) {
        nodes {
          id
          handle
          fields {
            key
            value
          }
        }
      }
    }
  `;

export const CUSTOMER_PLANNER_QUERY =
  /* GraphQL */
  `
    query GetCustomerPlanner($id: ID!, $namespace: String!, $key: String!) {
      customer(id: $id) {
        metafield(namespace: $namespace, key: $key) {
          ... on Metafield {
            reference {
              ... on Metaobject {
                handle
                fields {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  `;
