<template>
  <va-navbar-item>
    <va-popover
      placement="left"
      message="Toggle OpenDyslexic font"
      :prevent-overflow="true"
    >
      <va-icon
        :name="isDyslexicMode ? 'fa-eye-slash' : 'fa-eye'"
        @click="toggleDyslexicMode"
      />
    </va-popover>
  </va-navbar-item>

  <va-navbar-item>
    <profile-dropdown>
      <span v-if="!isMobile">{{ userName }}</span>
    </profile-dropdown>
  </va-navbar-item>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useGlobalStore } from "@/stores/global-store"
import ProfileDropdown from "./dropdowns/ProfileDropdown.vue"

withDefaults(
  defineProps<{
    userName?: string
    isTopBar?: boolean
    isMobile?: boolean
  }>(),
  {
    userName: "",
    isTopBar: false,
    isMobile: false,
  }
)

const GlobalStore = useGlobalStore()

const { isDyslexicMode } = storeToRefs(GlobalStore)

function toggleDyslexicMode() {
  GlobalStore.setDyslexicMode(!isDyslexicMode.value)
}

defineEmits<{
  (e: "update:isTopBar", isTopBar: boolean): void
}>()
</script>

<style lang="scss" scoped>
.app-navbar-actions {
  display: flex;
  align-items: center;

  .va-dropdown__anchor {
    color: var(--va-primary);
    fill: var(--va-primary);
  }

  &__item {
    padding: 0;
    margin-left: 1.25rem;
    margin-right: 1.25rem;

    svg {
      height: 24px;
    }

    &:last-of-type {
      margin-right: 0;
    }

    &--profile {
      display: flex;
      justify-content: center;
      margin: auto 0 auto 1.25rem;
    }

    .va-dropdown-content {
      background-color: var(--va-white);
    }

    @media screen and (max-width: 640px) {
      margin-right: 0;

      &:first-of-type {
        margin-left: 0;
      }

      &--profile {
        position: absolute;
        right: 0.75rem;
        top: 1.25rem;
        height: fit-content;
        margin: auto;
      }
    }
  }
}
</style>
