<template>
  <div class="profile-dropdown-wrapper">
    <va-dropdown
      v-model="isShown"
      class="profile-dropdown"
      stick-to-edges
      placement="bottom"
      :offset="[13, 0]"
    >
      <template #anchor>
        <span class="profile-dropdown__anchor">
          <slot />
          <va-icon
            class="px-2"
            :name="isShown ? 'angle_up' : 'angle_down'"
            :color="colors.primary"
          />
        </span>
      </template>
      <va-dropdown-content class="profile-dropdown__content">
        <va-list-item v-for="option in options" :key="option.name" class="pa-3">
          <router-link :to="option.redirectTo" class="profile-dropdown__item">
            {{ option.name }}
          </router-link>
        </va-list-item>
      </va-dropdown-content>
    </va-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useColors } from "vuestic-ui"

const { colors } = useColors()

withDefaults(
  defineProps<{
    options?: { name: string; redirectTo: string }[]
  }>(),
  {
    options: () => [
      {
        name: "My Profile",
        redirectTo: "/profile",
      },
      {
        name: "Logout",
        redirectTo: "/logout",
      },
    ],
  }
)

const isShown = ref(false)
</script>

<style lang="scss" scoped>
.profile-dropdown {
  cursor: pointer;

  &__anchor {
    display: inline-block;
  }

  &__item {
    display: block;
    color: var(--va-gray);

    &:hover,
    &:active {
      color: var(--va-primary);
    }
  }
}
</style>
