<template>
  <div class="ml-2 mb-4">
    <h4 class="va-h4 mb-4">
      <va-icon name="fa4-building" class="mr-4" />
      Location Details
    </h4>
  </div>

  <table class="va-table ma-4">
    <tbody>
      <tr>
        <td>ID</td>
        <td>{{ location.id }}</td>
      </tr>
      <tr>
        <td>Name</td>
        <td>{{ location.name }}</td>
      </tr>
      <tr>
        <td>Description</td>
        <td>{{ location.description }}</td>
      </tr>
      <tr>
        <td>Created At</td>
        <td>{{ location.createdAt }}</td>
      </tr>
      <tr>
        <td>Updated At</td>
        <td>{{ location.updatedAt }}</td>
      </tr>

      <tr>
        <td>Owner</td>
        <td @click="handleTenantClick(location.ownerID)">
          <a href="#" class="va-link">{{ location.ownerID }}</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useGraphqlStore } from "@/stores/graphql-store"
import router from "@/router"

const props = defineProps({
  id: {
    type: String,
    default: "",
    required: true,
  },
})

const graphql = useGraphqlStore()

const location = computed(() => {
  return graphql.getCurrentLocation
})

function handleTenantClick(id: string) {
  console.debug("handleTenantClick", id)
  router.push({ name: "tenant_details", params: { id } })
}

onMounted(() => {
  graphql.queryLocation(props.id)
})
</script>
