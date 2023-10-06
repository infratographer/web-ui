<template>
  <div class="ml-2 mb-4">
    <div class="row mb-3 justify-space-between">
      <div class="flex">
        <h4 class="va-h4 mb-4">
          <va-icon name="text_snippet" class="mr-4" />
          Annotation Namespace Details
        </h4>
      </div>
      <div class="flex">
        <div class="row mt-3 va-spacing-x-1">
          <AnnotationNamespaceDeleteModal
            :id="annotationNs.id"
            :name="annotationNs.name"
            @delete="redirect"
          />
        </div>
      </div>
    </div>
  </div>

  <table class="va-table ma-4">
    <tbody>
      <tr>
        <td>ID</td>
        <td>{{ annotationNs.id }}</td>
      </tr>
      <tr>
        <td>Name</td>
        <td>{{ annotationNs.name }}</td>
      </tr>
      <tr>
        <td>Private</td>
        <td>{{ annotationNs.private }}</td>
      </tr>
      <tr>
        <td>Created At</td>
        <td>{{ annotationNs.createdAt }}</td>
      </tr>
      <tr>
        <td>Updated At</td>
        <td>{{ annotationNs.updatedAt }}</td>
      </tr>

      <tr>
        <td>Owner</td>
        <td @click="handleTenantClick(annotationNs.ownerID)">
          <a href="#" class="va-link">{{ annotationNs.ownerID }}</a>
        </td>
      </tr>
      <tr>
        <td>Annotations</td>
        <td>
          {{ annotationNs.annotations?.length }}
          <table
            v-if="
              annotationNs.annotations && annotationNs.annotations.length > 0
            "
            class="va-table"
          >
            <tbody>
              <tr>
                <td>
                  <va-card
                    v-for="annotation in annotationNs.annotations"
                    :key="annotation.id"
                    class="mb-1"
                  >
                    <va-card-title>
                      Annotation ID: {{ annotation.id }}
                      <br />
                      Metadata ID: {{ annotation.metadataID }}
                      <br />
                      Node ID: {{ annotation.metadata?.nodeID }}
                    </va-card-title>
                    <va-card-content>
                      <br />
                      <pre>{{ JSON.stringify(annotation.data, null, 2) }}</pre>
                    </va-card-content>
                  </va-card>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useGraphqlStore } from "@/stores/graphql-store"
import router from "@/router"
import AnnotationNamespaceDeleteModal from "@/components/AnnotationNamespaceDeleteModal.vue"

const props = defineProps({
  id: {
    type: String,
    default: "",
    required: true,
  },
})

const graphql = useGraphqlStore()

const annotationNs = computed(() => {
  return graphql.getCurrentAnnotationNamespace
})

function handleTenantClick(id: string) {
  console.debug("handleTenantClick", id)
  graphql.queryTenant(id)
  router.push({ name: "tenant_details", params: { id } })
}

function redirect() {
  router.push({ name: "dashboard" })
}

function fetch() {
  graphql.queryAnnotationNamespace(props.id)
}

onMounted(() => {
  fetch()
})
</script>
