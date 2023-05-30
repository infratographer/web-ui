import { createApp, provide, h } from "vue"
import router from "./router"
import stores from "./stores"
import config from "./config"

import vue3GoogleLogin from "vue3-google-login"

import { DefaultApolloClient } from "@vue/apollo-composable"

import { createVuestic } from "vuestic-ui"
import vuesticGlobalConfig from "./services/vuestic-ui/global-config"

import { apolloClient } from "@/stores/graphql-store"
import { useGlobalStore } from "@/stores/global-store"

import App from "./App.vue"

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

app.use(router)
app.use(stores)
app.use(createVuestic({ config: vuesticGlobalConfig }))

app.use(vue3GoogleLogin, {
  clientId: config.oidc.clientId,
})

// redirect to /login if not authenticated
if (!useGlobalStore().isAuthenticated) {
  console.debug("user not authenticated, redirecting to login")
  router.push({ name: "login" })
}

app.mount("#app")
