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

export const fragmentAnnotationDetails = gql`
  fragment annotationDetails on Annotation {
    id
    data
    metadataID
    createdAt
    updatedAt
  }
`

export const fragmentAnnotationNamespaceDetails = gql`
  fragment annotationNamespaceDetails on AnnotationNamespace {
    id
    name
    private
    createdAt
    updatedAt
  }
`

export const fragmentMetadataDetails = gql`
  fragment metadataDetails on Metadata {
    id
    nodeID
    createdAt
    updatedAt
  }
`
