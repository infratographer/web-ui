import { createApp, provide, h } from "vue"
import router from "./router"
import stores from "./stores"
import config from "./config"

import { OktaAuth } from "@okta/okta-auth-js"
import type { OktaAuthOptions } from "@okta/okta-auth-js"
import OktaVue from "@okta/okta-vue"

import { DefaultApolloClient } from "@vue/apollo-composable"

import { createVuestic } from "vuestic-ui"
import vuesticGlobalConfig from "./services/vuestic-ui/global-config"

import { apolloClient } from "@/stores/graphql-store"
import { useGlobalStore } from "@/stores/global-store"

import App from "./App.vue"

// import { UserManager } from "oidc-client-ts"

// const oidcUserMgr = new UserManager(config.settings)

// auth.getUser().then((user) => {
//   if (user) {
//     console.debug("oidcUserMgr.getUser() found user", user)
//   } else {
//     router.push({ path: "/login" })
//   }
// })

// const app = createApp(App, {
//   setup() {
//     provide(DefaultApolloClient, apolloClient)
//   },
// })

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

app.use(router)
app.use(stores)
app.use(createVuestic({ config: vuesticGlobalConfig }))

const oktaAuth = new OktaAuth(<OktaAuthOptions>{
  ...config.oidc,
  restoreOriginalUri: postAuth,
})

// redirect to /login if not authenticated
app.use(OktaVue, {
  oktaAuth,
  onAuthRequired: () => {
    router.push({ path: "/login" })
  },
} as any)

app.mount("#app")

// this will get the details of the currently logged in user on page reload,
// unless login is already in progress (so we don't fetch twice in that case)
oktaAuth.authStateManager.subscribe((authState) => {
  if (useGlobalStore().isAuthInProgress) {
    return
  }

  if (authState.isAuthenticated && !useGlobalStore().isAuthInProgress) {
    useGlobalStore()
      .exchangeToken()
      .catch((err) => {
        console.error(err)
        router.replace({ name: "errors_token" })
      })
  }
})

// postAuth will be called right after successful authentication from Okta and will try to get info
// about the user from the api. If unsuccessful, it will sign them right out.
function postAuth(oktaAuth: OktaAuth, originalUri: string) {
  useGlobalStore()
    .exchangeToken()
    .then(() => {
      // redirect to the original uri
      router.replace({ path: originalUri })
    })
    .catch((err) => {
      console.error(err)
      router.replace({ name: "errors_token" })
    })
    .finally(() => {
      useGlobalStore().resetAuthInProgress()
    })
}
