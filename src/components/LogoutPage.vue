<script setup lang="ts">
import { useAuth } from "@okta/okta-vue"
import { onMounted } from "vue"

const auth = useAuth()

const logout = async () => {
  await auth.signOut()
}

onMounted(() => {
  logout()
})
</script>
