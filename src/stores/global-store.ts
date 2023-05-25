import { defineStore } from "pinia"
import axios from "axios"
import type { AxiosError } from "axios"
import config from "@/config"

import { useAuth } from "@okta/okta-vue"
import { useStorage } from "@vueuse/core"
import type { UserClaims } from "@okta/okta-auth-js"

const tokenXClient = axios.create({
  baseURL: config.tokenXchange.url,
  timeout: 5000,
})

export const useGlobalStore = defineStore("global", {
  state: () => ({
    dyslexicMode: useStorage("dyslexicMode", false),
    isAdmin: undefined as Boolean | undefined,
    isSidebarMinimized: useStorage("isSidebarMinimized", false),
    oidcUser: {} as UserClaims,
    i12rToken: "",
  }),

  getters: {
    isAuthInProgress() {
      const authInProgress = sessionStorage.getItem("authInProgress")
      if (authInProgress && typeof authInProgress === "string") {
        return true
      }
      return false
    },
    isDyslexicMode(state) {
      return state.dyslexicMode
    },
    getLoginError(): string {
      const loginError = sessionStorage.getItem("loginError")
      if (loginError && typeof loginError === "string") {
        return loginError
      }
      return ""
    },
    getToken(state) {
      return state.i12rToken
    },
    getUserName(state) {
      return state.oidcUser.name
    },
  },

  actions: {
    // exchangeToken calls the token exchange endpoint to get an infratographer token
    async exchangeToken() {
      const authToken = useAuth().getAccessToken()

      if (!authToken) {
        return
      }

      console.debug("exchanging token", authToken)

      const subjectToken = `subject_token=${authToken}`
      const grantType =
        "grant_type=urn:ietf:params:oauth:grant-type:token-exchange"
      const subjectTokenType =
        "subject_token_type=urn:ietf:params:oauth:token-type:jwt"

      try {
        const response = await tokenXClient.post(
          "/token",
          `${grantType}&${subjectToken}&${subjectTokenType}`
        )

        console.debug("token exchange response", response.data)
      } catch (err) {
        console.error(err)
        throw err as typeof AxiosError
      }
    },
    async setOidcUser() {
      const auth = useAuth()
      const user = await auth.getUser()
      this.oidcUser = user
    },
    resetAuthInProgress() {
      sessionStorage.removeItem("authInProgress")
    },
    resetLoginError() {
      sessionStorage.removeItem("loginError")
    },
    setAuthInProgress() {
      sessionStorage.setItem("authInProgress", "true")
    },
    setDyslexicMode(mode: boolean) {
      this.dyslexicMode = mode
    },
    setLoginError(msg: string) {
      sessionStorage.setItem("loginError", JSON.stringify(msg))
    },
  },
})
