<template>
  <va-alert
    v-if="loginError"
    color="danger"
    :title="'Login error'"
    icon="error"
    center
    class="mt-4"
  >
    {{ loginError }}
  </va-alert>

  <div class="auth-layout row align-content-center">
    <div class="flex xs12">
      <div class="d-flex justify-center">
        <va-card class="auth-layout__card pa-3">
          <va-card-actions align="stretch" vertical>
            <div class="d-flex justify-center mb-2">
              <va-image
                :src="infratographerLogo"
                style="width: 500px; height: 129px"
              />
            </div>

            <div class="d-flex justify-center">
              <va-button
                v-if="authState && authState.isAuthenticated"
                preset="primary"
                size="large"
                @click="redirect"
                >Login</va-button
              >
              <va-button v-else preset="primary" size="large" @click="login"
                >Login with SSO</va-button
              >
            </div>
          </va-card-actions>
        </va-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import InfratographerLogo from "@/components/logos/infratographer_logo_text.png"
// import auth from "@/auth"
import { useAuth } from "@okta/okta-vue"
import { useGlobalStore } from "@/stores/global-store"
import { useRouter } from "vue-router"

const infratographerLogo = InfratographerLogo

const GlobalStore = useGlobalStore()
const router = useRouter()
const auth = useAuth()

const login = async () => {
  GlobalStore.setAuthInProgress()
  await auth.signInWithRedirect()
}

const redirect = async () => {
  router.push({ name: "dashboard" })
}

const loginError = computed(() => {
  return GlobalStore.getLoginError
})

onMounted(() => {
  GlobalStore.resetLoginError()
})
</script>

<style lang="scss">
.auth-layout {
  min-height: 100vh;
  background-image: linear-gradient(
    to right,
    var(--va-background-primary),
    var(--va-white)
  );
  &__card {
    width: 100%;
    max-width: 600px;
  }
}
</style>
