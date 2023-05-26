<template>
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
              <GoogleLogin :callback="callback" prompt auto-login />
            </div>
          </va-card-actions>
        </va-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InfratographerLogo from "@/components/logos/infratographer_logo_text.png"
import { useGlobalStore } from "@/stores/global-store"
import { useRouter } from "vue-router"

const router = useRouter()

const callback = (response: any) => {
  console.debug("callback response", response)

  useGlobalStore().saveJwt(response.credential)
  useGlobalStore().exchangeToken(response.credential)

  router.push({ name: "dashboard" })
}

const infratographerLogo = InfratographerLogo
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
