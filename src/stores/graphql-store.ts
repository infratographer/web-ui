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
  ownerId: string
  createdAt: string
  updatedAt: string
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

  const getCurrentLocation = computed(() => {
    return currentLocation.value
  })

  const getCurrentTenant = computed(() => {
    return currentTenant.value
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
        // fetchPolicy: "no-cache",
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
        }
      }
      ${fragmentTenantDetails}
    `

    try {
      const response = await apolloClient.query({
        query: query,
        variables: { id: id },
        // fetchPolicy: "no-cache",
      })

      console.debug("response", response)
      currentTenant.value = graphqlDataToTenant(response.data?.tenant)
    } catch (err) {
      console.error(err.message)
    }
  }

  return {
    getCurrentLocation,
    getCurrentTenant,
    getRootTenantID,
    setRootTenantID,
    queryLocation,
    queryTenant,
  }
})

function graphqlDataToLocation(data: any): Location {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    ownerId: data.owner?.id,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

function graphqlDataToTenant(data: any): Tenant {
  if (!data) {
    return {} as Tenant
  }

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
    locations: locations,
    parent: graphqlDataToTenant(data.parent),
    children: children,
  }
}
