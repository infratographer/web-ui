import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"
import axios from "axios"
import type { AxiosError } from "axios"
import config from "@/config"

import { decodeCredential } from "vue3-google-login"

const tokenXClient = axios.create({
  baseURL: config.tokenXchange.url,
  timeout: 5000,
})

export const useGlobalStore = defineStore("global", {
  state: () => ({
    dyslexicMode: useStorage("dyslexicMode", false),
    jwtToken: useStorage("oidc-jwt-token", ""),
    isSidebarMinimized: useStorage("isSidebarMinimized", false),
    oidcUserData: {},
    i12rToken: "",
  }),

  getters: {
    isAuthenticated(state) {
      return state.jwtToken !== ""
    },
    isDyslexicMode(state) {
      return state.dyslexicMode
    },
    getJwt(state) {
      return state.jwtToken
    },
    getToken(state) {
      return state.i12rToken
    },
    getUserData(state) {
      const userData: any = decodeCredential(state.jwtToken)
      return userData
    },
    getUserName(state) {
      const userData: any = decodeCredential(state.jwtToken)
      return userData.name
    },
  },

  actions: {
    // exchangeToken calls the token exchange endpoint to get an infratographer token
    async exchangeToken(authToken: string) {
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
    async setOidcUserData(data: any) {
      this.oidcUserData = data

      console.debug("oidcUserData", this.oidcUserData)
    },
    resetJwt() {
      this.jwtToken = ""
    },
    setDyslexicMode(mode: boolean) {
      this.dyslexicMode = mode
    },
    saveJwt(token: string) {
      this.jwtToken = token
    },
  },
})
