<template>
  <div class="row">
    <div class="flex">
      <va-card class="py-3 px-5">
        <div>{{ userData }}</div>
      </va-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/global-store"

const GlobalStore = useGlobalStore()

const userData = GlobalStore.getUserData
</script>
