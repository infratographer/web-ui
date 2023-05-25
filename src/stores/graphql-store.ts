import { defineStore } from "pinia"
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core"
import config from "@/config"
import { useGlobalStore } from "./global-store"

// This store might end up being unnecessary but leaving for now
// until we can figure out if we can centralize some of the graphql
// logic here.

const httpLink = createHttpLink({
  uri: config.graphql.url,
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

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache,
})

export const useGraphqlStore = defineStore("graphql", {
  state: () => ({}),

  getters: {},

  actions: {},
})
