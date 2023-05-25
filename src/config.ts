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
  // settings: {
  //   authority: "https://sso.equinixmetal.com/oauth2/default",
  //   // metadata: {
  //   //   issuer: "https://github.com/login/oauth/authorize",
  //   //   authorization_endpoint: "https://github.com/login/oauth/authorize",
  //   // },
  //   client_id: "0oa3aprm1rLihHxZj697",
  //   redirect_uri: window.location.origin + "/login/callback",
  //   // redirectMethod: "assign",
  //   // post_logout_redirect_uri: url,
  //   response_type: "code",
  //   scope: "openid email profile",
  //   userStore: new WebStorageStateStore({ store: window.localStorage }),

  //   // response_mode: "fragment",

  //   // popup_redirect_uri: window.location.origin + "/login/callback",
  //   // popup_post_logout_redirect_uri: url + "/sample-popup-signout.html",

  //   // silent_redirect_uri: url + "/sample-silent.html",
  //   // automaticSilentRenew: true,
  //   //silentRequestTimeout: 10000,

  //   // filterProtocolClaims: true
  // } as UserManagerSettings,
}
