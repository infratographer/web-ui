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
        <td>
          {{ tenant.children?.length }}
          <TenantAddModal
            :parentID="tenant.id"
            :parentName="tenant.name"
            @add="fetch"
          />
          <table
            v-if="tenant.children && tenant.children.length > 0"
            class="va-table"
          >
            <tbody>
              <tr>
                <td>
                  <va-list class="mt-3">
                    <va-list-item
                      v-for="child in tenant.children"
                      :key="child.id"
                      class="mb-1"
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
              </tr>
            </tbody>
          </table>
        </td>
      </tr>

      <tr>
        <td>Locations</td>
        <td>
          {{ tenant.locations?.length }}
          <LocationAddModal
            :parentID="tenant.id"
            :parentName="tenant.name"
            @add="fetch"
          />
          <table
            v-if="tenant.locations && tenant.locations.length > 0"
            class="va-table"
          >
            <tbody>
              <tr>
                <td>
                  <va-list class="mt-3">
                    <va-list-item
                      v-for="location in tenant.locations"
                      :key="location.id"
                      class="mb-1"
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
              </tr>
            </tbody>
          </table>
        </td>
      </tr>

      <tr>
        <td>Annotation Namespaces</td>
        <td class="flex">
          {{ tenant.annotationNamespaces?.length }}
          <AnnotationNamespaceAddModal
            :parentID="tenant.id"
            :parentName="tenant.name"
            @add="fetch"
          />
          <table
            v-if="
              tenant.annotationNamespaces &&
              tenant.annotationNamespaces.length > 0
            "
            class="va-table"
          >
            <tbody>
              <tr>
                <td>
                  <div class="flex row my-2">
                    <va-card
                      v-for="an in tenant.annotationNamespaces"
                      :key="an.id"
                      class="mb-1 flex sm12"
                    >
                      <va-card-title>
                        <va-icon
                          name="text_snippet"
                          size="small"
                          class="mr-2"
                        />
                        <a
                          href="#"
                          class="va-link"
                          @click="handleAnnotationNamespaceClick(an.id)"
                          >{{ an.name }}</a
                        >
                      </va-card-title>
                      <va-card-content>
                        <div v-if="an.annotations?.length == 0">
                          <AnnotationAddUpdateModal
                            operation="Add"
                            :namespaceID="an.id"
                            :namespaceName="an.name"
                            :nodeID="tenant.id"
                            :nodeName="tenant.name"
                            @update="fetch"
                          />
                        </div>

                        <div v-else-if="an.annotations.length === 1">
                          <div class="row justify-end mr-1">
                            <AnnotationAddUpdateModal
                              operation="Update"
                              :namespaceID="an.id"
                              :namespaceName="an.name"
                              :nodeID="tenant.id"
                              :nodeName="tenant.name"
                              :annotation="an.annotations[0].data"
                              @update="fetch"
                            />
                            <AnnotationDeleteModal
                              :namespaceID="an.id"
                              :namespaceName="an.name"
                              :nodeID="tenant.id"
                              :nodeName="tenant.name"
                              @delete="fetch"
                            />
                          </div>

                          <div
                            v-for="annotation in an.annotations"
                            :key="annotation.id"
                            class="va-text-block"
                            style="white-space: pre-wrap"
                          >
                            {{ JSON.stringify(annotation.data, null, 2) }}
                          </div>
                        </div>

                        <div v-else>
                          Unexpected number of annotations ({{
                            an.annotations.length
                          }})!
                        </div>
                      </va-card-content>
                    </va-card>
                  </div>
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

import TenantAddModal from "@/components/TenantAddModal.vue"
import LocationAddModal from "@/components/LocationAddModal.vue"
import AnnotationAddUpdateModal from "./AnnotationAddUpdateModal.vue"
import AnnotationDeleteModal from "./AnnotationDeleteModal.vue"
import AnnotationNamespaceAddModal from "./AnnotationNamespaceAddModal.vue"

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
  router.push({ name: "tenant_details", params: { id } })
}

function handleLocationClick(id: string) {
  console.debug("handleLocationClick", id)
  router.push({ name: "location_details", params: { id } })
}

function handleAnnotationNamespaceClick(id: string) {
  console.debug("handleAnnotationNamespaceClick", id)
  router.push({ name: "annotation_ns_details", params: { id } })
}

function fetch() {
  graphql.queryTenant(props.id)
}

onMounted(() => {
  fetch()
})
</script>
