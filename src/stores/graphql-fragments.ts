import gql from "graphql-tag"

export const fragmentLocationDetails = gql`
  fragment locationDetails on Location {
    id
    name
    description
    createdAt
    updatedAt
  }
`

export const fragmentTenantDetails = gql`
  fragment tenantDetails on Tenant {
    id
    name
    description
    createdAt
    updatedAt
  }
`
