<template>
  <div id="dashboard-view">
    <div class="flex row row-equal">
      <div class="flex ma-3">
        <va-card>
          <va-card-title> Tenant graph </va-card-title>
          <va-card-content>
            <div class="pa-3">
              <va-tree-view
                :nodes="tenants"
                :expandAll="treeExpand"
                class="customizable-content"
              >
                <template #content="node">
                  <div class="row align-center ma-3">
                    <span class="pointer" @click="handleNodeClick(node)">
                      <va-icon
                        v-if="node.type === 'Tenant'"
                        name="fa4-sitemap"
                        class="mr-4"
                      />
                      <va-icon
                        v-else-if="node.type === 'Location'"
                        name="fa4-building"
                        class="mr-4"
                      />
                    </span>

                    <span class="pointer" @click="handleNodeClick(node)">
                      <div>
                        <b v-if="node.label" class="display-6">{{
                          node.label
                        }}</b>
                        <p
                          v-if="node.description"
                          class="va-text-secondary mt-1"
                        >
                          {{ node.description }}
                        </p>
                      </div>
                    </span>

                    <va-button
                      v-if="node.type === 'Tenant'"
                      preset="secondary"
                      icon="add"
                      class="ml-auto"
                      @click="showCreateModal(node)"
                    />
                  </div>
                </template>
              </va-tree-view>
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>
  </div>

  <va-modal
    v-model="isShowCreateModal"
    title="Create new tenant or location"
    no-outside-dismiss
    hide-default-actions
  >
    <va-form ref="refCreateForm" class="my-4" style="width: 30rem" autofocus>
      <div class="mb-4">
        Create a new node under tenant {{ createForm.parentName }}.
      </div>

      <va-radio
        v-for="(option, i) in nodeTypes"
        :key="i"
        :label="option"
        v-model="createForm.nodeType"
        :option="option"
        class="mb-4"
        prevent-overflow
      />

      <va-input label="Parent ID" v-model="createForm.parentID" readonly />
      <va-input
        label="Name"
        v-model.trim="createForm.name"
        :rules="[validateName]"
        class="mt-3"
      />
      <va-input
        class="mt-3"
        label="Description"
        v-model.trim="createForm.description"
        :rules="[validateDescription]"
      />
    </va-form>

    <template #footer>
      <va-button
        @click="closeCreateModal"
        preset="outline"
        color="secondary"
        class="mr-3"
      >
        Cancel
      </va-button>

      <va-button type="submit" @click="handleCreate">
        Create {{ createForm.nodeType }}
      </va-button>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue"
import { useRouter } from "vue-router"

import { useQuery, useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"
import type { TreeNode } from "vuestic-ui"

const router = useRouter()

const refCreateForm = ref()
const isShowCreateModal = ref(false)

const nodeTypes = ["Tenant", "Location"]

const createForm = reactive({
  parentID: "",
  parentName: "",
  nodeType: nodeTypes[0],
  name: "",
  description: "",
})

// temporary here until we can list all tenants
const rootTenant = "tnntten-TYScYJGsIhBs1aRIX5tp0"

const { result, loading, error, refetch } = useQuery(
  gql`
    query getTenant($id: ID!) {
      tenant(id: $id) {
        id
        name
        description
        children {
          edges {
            node {
              id
              name
              description
              children {
                edges {
                  node {
                    id
                    name
                    description
                    locations {
                      edges {
                        node {
                          id
                          name
                          description
                        }
                      }
                    }
                  }
                }
              }
              locations {
                edges {
                  node {
                    id
                    name
                    description
                  }
                }
              }
            }
          }
        }
        locations {
          edges {
            node {
              id
              name
              description
            }
          }
        }
      }
    }
  `,
  {
    id: rootTenant,
  }
)

const { mutate: createTenant, error: createTenantError } = useMutation(
  gql`
    mutation createTenant($input: CreateTenantInput!) {
      tenantCreate(input: $input) {
        tenant {
          id
          name
        }
      }
    }
  `,
  () => ({
    variables: {
      input: {
        parentID: createForm.parentID,
        name: createForm.name,
        description: createForm.description,
      },
    },
  })
)

const { mutate: createLocation, error: createLocationError } = useMutation(
  gql`
    mutation createLocation($input: CreateLocationInput!) {
      locationCreate(input: $input) {
        location {
          id
          name
        }
      }
    }
  `,
  () => ({
    variables: {
      input: {
        ownerID: createForm.parentID,
        name: createForm.name,
        description: createForm.description,
      },
    },
  })
)

const treeExpand = computed(() => {
  return !loading.value && !error.value
})

const tenants = computed(() => {
  if (!result.value?.tenant) {
    return [] as TreeNode[]
  }

  const root: TreeNode = {
    id: result.value.tenant.id,
    type: result.value.tenant.__typename,
    label: result.value.tenant.name,
    description: result.value.tenant.description,
    children: getChildren(
      result.value.tenant.children.edges,
      result.value.tenant.locations.edges
    ),
  }

  return [root] as TreeNode[]
})

function validateName(value: string) {
  if (!value || value.length <= 0) {
    return "Name is required"
  }

  return true
}

function validateDescription(value: string) {
  if (!value || value.length <= 0) {
    return "Description is required"
  }

  return true
}

function showCreateModal(node: TreeNode) {
  createForm.parentID = node.id.toString()
  createForm.parentName = node.label
  isShowCreateModal.value = true
}

function closeCreateModal() {
  isShowCreateModal.value = false
  createForm.name = ""
  createForm.description = ""
}

function handleCreate() {
  if (!refCreateForm.value.validate()) {
    return
  }

  console.debug("handleCreate", createForm)

  switch (createForm.nodeType) {
    case "Tenant":
      createTenant()
      break
    case "Location":
      createLocation()
      break
  }

  console.debug("handleCreate errors", createTenantError, createLocationError)

  closeCreateModal()

  refetch()
}

function handleNodeClick(node: TreeNode) {
  console.debug("handleNodeClick", node)

  switch (node.type) {
    case "Tenant":
      router.push({ name: "tenant_details", params: { id: node.id } })
      break
    case "Location":
      router.push({ name: "location_details", params: { id: node.id } })
      break
    default:
      console.error("unknown node type", node.Type)
  }
}

// getChildren is a recursive function that loops over all levels of tenant children and locations
function getChildren(children: [], locations: []): TreeNode[] {
  const nodes = [] as TreeNode[]

  if (locations) {
    locations.forEach((location: any) => {
      nodes.push({
        id: location.node.id,
        type: location.node.__typename,
        label: location.node.name,
        description: location.node.description,
      })
    })
  }

  if (children) {
    children.forEach((child: any) => {
      nodes.push({
        id: child.node.id,
        type: child.node.__typename,
        label: child.node.name,
        description: child.node.description,
        children: getChildren(
          child.node.children?.edges,
          child.node.locations?.edges
        ),
      })
    })
  }

  return nodes
}
</script>

<style scoped lang="scss">
.row-equal .flex {
  .va-card {
    height: 100%;
  }
}
.va-card {
  margin-bottom: 0 !important;
  &__title {
    display: flex;
    justify-content: space-between;
  }
}
.hoverable {
  &:hover {
    background-color: #f6f6f6;
  }
}
</style>
