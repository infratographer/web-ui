<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { googleLogout } from "vue3-google-login"

import { useGlobalStore } from "@/stores/global-store"

onMounted(() => {
  googleLogout()

  useGlobalStore().resetJwt()

  useRouter().push({ name: "login" })
})
</script>
