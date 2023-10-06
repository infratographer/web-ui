import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useStorage } from "@vueuse/core"
import { useGlobalStore } from "./global-store"
import config from "@/config"

import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core"
import { provideApolloClient, useApolloClient } from "@vue/apollo-composable"
import { onError } from "@apollo/client/link/error"

import gql from "graphql-tag"
import {
  fragmentLocationDetails,
  fragmentTenantDetails,
  fragmentAnnotationDetails,
  fragmentAnnotationNamespaceDetails,
  fragmentMetadataDetails,
} from "./graphql-fragments"

const httpLink = createHttpLink({
  uri: config.graphql.url,
})

// for handling all graphql errors in the response
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
})

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization token to the headers
  const token = useGlobalStore().getToken

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    },
  })

  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: authMiddleware.concat(errorLink.concat(httpLink)),
  cache: new InMemoryCache(),
})

export interface Location {
  id: string
  name: string
  description: string
  ownerID: string
  createdAt: string
  updatedAt: string
}

export interface Annotation {
  id: string
  data: JSON
  metadataID: string
  metadata: Metadata
  namespace: AnnotationNamespace
  createdAt: string
  updatedAt: string
}

export interface AnnotationNamespace {
  id: string
  name: string
  ownerID: string
  private: boolean
  createdAt: string
  updatedAt: string
  annotations: Annotation[]
}

export interface Metadata {
  id: string
  nodeID: string
  createdAt: string
  updatedAt: string
  annotations: Annotation[]
}

export interface Tenant {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  parent: Tenant
  children: Tenant[]
  locations: Location[]
  annotationNamespaces: AnnotationNamespace[]
}

export const useGraphqlStore = defineStore("graphql", () => {
  useApolloClient()
  provideApolloClient(apolloClient)

  const rootTenantID = useStorage("i12r-root-tenant-id", "")

  const getRootTenantID = computed(() => {
    return rootTenantID.value
  })

  function setRootTenantID(id: string) {
    rootTenantID.value = id
  }

  const currentLocation = ref({} as Location)
  const currentTenant = ref({} as Tenant)
  const currentAnnotationNamespace = ref({} as AnnotationNamespace)

  const getCurrentLocation = computed(() => {
    return currentLocation.value
  })

  const getCurrentTenant = computed(() => {
    return currentTenant.value
  })

  const getCurrentAnnotationNamespace = computed(() => {
    return currentAnnotationNamespace.value
  })

  async function queryLocation(id: string) {
    console.debug("query location", id)

    const query = gql`
      query getLocation($id: ID!) {
        location(id: $id) {
          ...locationDetails
          metadata {
            id
          }
          owner {
            id
          }
        }
      }
      ${fragmentLocationDetails}
    `

    try {
      const response = await apolloClient.query({
        query: query,
        variables: { id: id },
        fetchPolicy: "no-cache",
      })

      console.debug("response", response)
      currentLocation.value = graphqlDataToLocation(response.data?.location)
    } catch (err) {
      console.error(err.message)
    }
  }

  async function queryTenant(id: string) {
    console.debug("query tenant", id)

    const query = gql`
      query getTenant($id: ID!) {
        tenant(id: $id) {
          ...tenantDetails
          parent {
            ...tenantDetails
          }
          children {
            edges {
              node {
                ...tenantDetails
              }
            }
          }
          locations {
            edges {
              node {
                id
                name
                description
              }
            }
          }
          annotationNamespaces {
            edges {
              node {
                ...annotationNamespaceDetails
                annotations {
                  ...annotationDetails
                  namespace {
                    ...annotationNamespaceDetails
                  }
                }
              }
            }
          }
        }
      }
      ${fragmentAnnotationDetails}
      ${fragmentAnnotationNamespaceDetails}
      ${fragmentTenantDetails}
    `

    try {
      const response = await apolloClient.query({
        query: query,
        variables: { id: id },
        fetchPolicy: "no-cache",
      })

      console.debug("response", response)
      currentTenant.value = graphqlDataToTenant(response.data?.tenant)
    } catch (err) {
      console.error(err.message)
    }
  }

  async function queryAnnotationNamespace(id: string) {
    console.debug("query annotation namespace", id)

    const query = gql`
      query getAnnotationNamespace($id: ID!) {
        annotationNamespace(id: $id) {
          ...annotationNamespaceDetails
          annotations {
            ...annotationDetails
            metadata {
              ...metadataDetails
            }
          }
        }
      }
      ${fragmentAnnotationDetails}
      ${fragmentAnnotationNamespaceDetails}
      ${fragmentMetadataDetails}
    `

    try {
      const response = await apolloClient.query({
        query: query,
        variables: { id: id },
        fetchPolicy: "no-cache",
      })

      console.debug("response", response)
      currentAnnotationNamespace.value = graphqlDataToAnnotationNamespace(
        response.data?.annotationNamespace
      )
    } catch (err) {
      console.error(err.message)
    }
  }

  return {
    getCurrentLocation,
    getCurrentTenant,
    getCurrentAnnotationNamespace,
    getRootTenantID,
    setRootTenantID,
    queryLocation,
    queryTenant,
    queryAnnotationNamespace,
  }
})

// Helper functions to convert graphql data to our types

function graphqlDatatoMetadata(data: any): Metadata {
  return {
    id: data.id,
    nodeID: data.nodeID,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    annotations: data.annotations?.edges.map((edge: any) => {
      return graphqlDataToAnnotation(edge.node)
    }),
  }
}

function graphqlDataToAnnotation(data: any): Annotation {
  return {
    id: data.id,
    data: data.data,
    metadataID: data.metadataID,
    metadata: data.metadata
      ? graphqlDatatoMetadata(data.metadata)
      : ({} as Metadata),
    namespace: data.namespace
      ? graphqlDataToAnnotationNamespace(data.namespace)
      : ({} as AnnotationNamespace),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

function graphqlDataToAnnotationNamespace(data: any): AnnotationNamespace {
  const annotations: Annotation[] = data.annotations?.map((node: any) => {
    return graphqlDataToAnnotation(node)
  })

  return {
    id: data.id,
    name: data.name,
    ownerID: data.owner?.id,
    private: data.private || false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    annotations: annotations,
  }
}

function graphqlDataToLocation(data: any): Location {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    ownerID: data.owner?.id,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

function graphqlDataToTenant(data: any): Tenant {
  if (!data) {
    return {} as Tenant
  }

  const annotationNamespaces: AnnotationNamespace[] =
    data.annotationNamespaces?.edges.map((edge: any) => {
      return graphqlDataToAnnotationNamespace(edge.node)
    })

  const locations: Location[] = data.locations?.edges.map((edge: any) => {
    return graphqlDataToLocation(edge.node)
  })

  const children: Tenant[] = data.children?.edges.map((edge: any) => {
    return graphqlDataToTenant(edge.node)
  })

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    parent: graphqlDataToTenant(data.parent),
    children: children,
    annotationNamespaces: annotationNamespaces,
    locations: locations,
  }
}
