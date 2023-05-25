<template>
  <va-navbar>
    <template #left>
      <va-navbar-item class="left">
        <va-icon-menu-collapsed
          :class="{ 'x-flip': isSidebarMinimized }"
          :color="colors.primary"
          @click="isSidebarMinimized = !isSidebarMinimized"
        />
        <router-link to="/">
          <va-image
            :src="infratographerLogo"
            style="width: 250px; height: 65px"
          />
        </router-link>
      </va-navbar-item>
    </template>

    <template #right>
      <AppNavbarActions :user-name="getUserName" :is-mobile="isMobile" />
    </template>
  </va-navbar>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { useGlobalStore } from "@/stores/global-store"
import { useColors } from "vuestic-ui"
import VaIconMenuCollapsed from "../icons/VaIconMenuCollapsed.vue"
import AppNavbarActions from "./components/AppNavbarActions.vue"
import InfratographerLogo from "@/components/logos/infratographer_logo_text.png"

withDefaults(
  defineProps<{
    isMobile?: boolean
  }>(),
  {
    isMobile: false,
  }
)

const infratographerLogo = InfratographerLogo

const GlobalStore = useGlobalStore()

// set the user from the oidc token
GlobalStore.setOidcUser()

const { isSidebarMinimized, getUserName } = storeToRefs(GlobalStore)

const { getColors } = useColors()
const colors = computed(() => getColors())
</script>

<style lang="scss" scoped>
.va-navbar {
  flex-direction: row;
  box-shadow: var(--va-box-shadow);
  z-index: 2;

  @media screen and (max-width: 950px) {
    .left {
      width: 100%;
    }

    .app-navbar__actions {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}

.left {
  display: flex;
  align-items: center;

  & > * {
    margin-right: 1.5rem;
  }

  & > *:last-child {
    margin-right: 0;
  }
}

.x-flip {
  transform: scaleX(-100%);
}

.app-navbar-center {
  display: flex;
  align-items: center;

  @media screen and (max-width: 1200px) {
    &__github-button {
      display: none;
    }
  }

  @media screen and (max-width: 950px) {
    &__text {
      display: none;
    }
  }
}
</style>
