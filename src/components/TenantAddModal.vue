<template>
  <va-button
    class="ml-4"
    size="small"
    icon="add"
    preset="secondary"
    border-color="primary"
    @click="showCreateModal"
    >Add tenant</va-button
  >

  <va-modal
    v-model="isShowCreateModal"
    title="Add tenant"
    no-outside-dismiss
    hide-default-actions
  >
    <va-form ref="refCreateForm" class="my-4" autofocus>
      <div class="mb-4">
        Create a sub-tenant under tenant {{ props.parentName }}.
      </div>

      <va-input label="Parent ID" :model-value="props.parentID" readonly />
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

      <va-button type="submit" @click="handleAdd"> Create tenant </va-button>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"

import { useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"

const props = defineProps({
  parentID: {
    type: String,
    default: "",
    required: true,
  },
  parentName: {
    type: String,
    default: "",
    required: true,
  },
})

const emit = defineEmits(["add"])

const refCreateForm = ref()
const isShowCreateModal = ref(false)

const createForm = reactive({
  name: "",
  description: "",
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

function showCreateModal() {
  isShowCreateModal.value = true
}

function closeCreateModal() {
  isShowCreateModal.value = false
  createForm.name = ""
  createForm.description = ""
}

function handleAdd() {
  if (!refCreateForm.value.validate()) {
    return
  }

  createTenant()
  emit("add")

  closeCreateModal()
}

const { mutate: createTenant } = useMutation(
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
        parentID: props.parentID,
        name: createForm.name,
        description: createForm.description,
      },
    },
  })
)
</script>
