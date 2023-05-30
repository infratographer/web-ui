<template>
  <router-view />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useGlobalStore } from "@/stores/global-store"
import { storeToRefs } from "pinia"

const GlobalStore = useGlobalStore()
const { isDyslexicMode } = storeToRefs(GlobalStore)

const getFontFamily = computed(() => {
  if (isDyslexicMode.value) {
    return "OpenDyslexic"
  } else {
    return "Gotham"
  }
})
</script>

<style lang="scss">
@import "scss/main.scss";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

// dynamically set the font
* {
  font-family: v-bind(getFontFamily), Arial, sans-serif;
}

body {
  margin: 0;
}

.table-pagination {
  padding-top: 1rem !important;
  display: flex;
  justify-content: center;
}

.pointer {
  cursor: pointer;
}

// change some Vuestic defaults
:root {
  --va-font-family: "Gotham", Arial, sans-serif;
}
</style>
