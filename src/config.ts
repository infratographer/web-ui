/* eslint-disable */

// import type { UserManagerSettings } from "oidc-client-ts"
// import { WebStorageStateStore } from "oidc-client-ts"

// @ts-ignore
const graphqlUrl = baseconf.GRAPHQL_URL || import.meta.env.VITE_GRAPHQL_URL

// @ts-ignore
const tokenXchangeUrl = baseconf.TOKENXCHANGE_URL || import.meta.env.VITE_TOKENXCHANGE_URL

// @ts-ignore
const oidcClientId = baseconf.OIDC_CLIENT_ID || import.meta.env.VITE_OIDC_CLIENT_ID

// @ts-ignore
const oidcIssuer = baseconf.OIDC_ISSUER || import.meta.env.VITE_OIDC_ISSUER

export default {
  oidc: {
    clientId: oidcClientId as string,
    issuer: oidcIssuer as string,
    redirectUri: window.location.origin + "/login/callback",
    scopes: ["openid", "profile", "email"],
  },
  graphql: {
    url: graphqlUrl as string,
  },
  tokenXchange: {
    url: tokenXchangeUrl as string,
  },
}
