<template>
  <div class="ml-2 mb-4">
    <h4 class="va-h4 mb-4">
      <va-icon name="fa4-sitemap" class="mr-4" />
      Tenant Details
    </h4>
  </div>

  <table class="va-table ma-4">
    <tbody>
      <tr>
        <td>ID</td>
        <td>{{ tenant.id }}</td>
      </tr>
      <tr>
        <td>Name</td>
        <td>{{ tenant.name }}</td>
      </tr>
      <tr>
        <td>Description</td>
        <td>{{ tenant.description }}</td>
      </tr>
      <tr>
        <td>Created At</td>
        <td>{{ tenant.createdAt }}</td>
      </tr>
      <tr>
        <td>Updated At</td>
        <td>{{ tenant.updatedAt }}</td>
      </tr>
      <tr>
        <td>Locations</td>
        <td v-if="tenant.locations && tenant.locations.length > 0">
          {{ tenant.locations.length }}
          <va-list class="mt-3">
            <va-list-item
              v-for="location in tenant.locations"
              :key="location.id"
              class=""
            >
              <va-list-item-section avatar>
                <va-icon name="fa4-building" />
              </va-list-item-section>
              <va-list-item-section>
                <a
                  href="#"
                  class="va-link"
                  @click="handleLocationClick(location.id)"
                  >{{ location.name }}</a
                >
              </va-list-item-section>
            </va-list-item>
          </va-list>
        </td>
        <td v-else>-</td>
      </tr>

      <tr>
        <td>Parent</td>
        <td
          v-if="tenant.parent?.id"
          @click="handleTenantClick(tenant.parent.id)"
        >
          <a href="#" class="va-link">{{ tenant.parent.name }}</a>
        </td>
        <td v-else>[root]</td>
      </tr>
      <tr>
        <td>Children</td>
        <td v-if="tenant.children && tenant.children.length > 0">
          {{ tenant.children.length }}
          <va-list class="mt-3">
            <va-list-item
              v-for="child in tenant.children"
              :key="child.id"
              class="pb-1"
            >
              <va-list-item-section avatar>
                <va-icon name="fa4-sitemap" />
              </va-list-item-section>
              <va-list-item-section>
                <a
                  href="#"
                  class="va-link"
                  @click="handleTenantClick(child.id)"
                  >{{ child.name }}</a
                >
              </va-list-item-section>
            </va-list-item>
          </va-list>
        </td>
        <td v-else>-</td>
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

const tenant = computed(() => {
  return graphql.getCurrentTenant
})

function handleTenantClick(id: string) {
  console.debug("handleTenantClick", id)
  graphql.queryTenant(id)
}

function handleLocationClick(id: string) {
  console.debug("handleLocationClick", id)
  router.push({ name: "location_details", params: { id } })
}

onMounted(() => {
  graphql.queryTenant(props.id)
})
</script>
