<template>
  <va-button
    class="ml-4"
    size="small"
    icon="add"
    preset="secondary"
    border-color="primary"
    @click="showCreateModal"
    >Add annotation namespace</va-button
  >

  <va-modal
    v-model="isShowCreateModal"
    title="Add annotation namespace"
    no-outside-dismiss
    hide-default-actions
  >
    <va-form ref="refCreateForm" class="my-4">
      <div class="mb-4">
        Create an annotation namespace under tenant {{ props.parentName }}.
      </div>

      <va-input label="Parent ID" :model-value="props.parentID" readonly />
      <va-input
        label="Name"
        v-model.trim="createForm.name"
        :rules="[validateName]"
        class="mt-3"
      />
      <va-checkbox
        label="Private"
        v-model="createForm.private"
        left-label
        class="mt-3"
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

      <va-button type="submit" @click="handleAdd">
        Create annotation namespace
      </va-button>
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
  private: false,
})

function validateName(value: string) {
  if (!value || value.length <= 0) {
    return "Name is required"
  }

  return true
}

function showCreateModal() {
  isShowCreateModal.value = true
}

function closeCreateModal() {
  isShowCreateModal.value = false
  createForm.name = ""
  createForm.private = false
}

function handleAdd() {
  if (!refCreateForm.value.validate()) {
    return
  }

  createAnnotationNamespace()
  emit("add")

  closeCreateModal()
}

const { mutate: createAnnotationNamespace } = useMutation(
  gql`
    mutation createAnnotationNamespace(
      $input: CreateAnnotationNamespaceInput!
    ) {
      annotationNamespaceCreate(input: $input) {
        annotationNamespace {
          id
          name
        }
      }
    }
  `,
  () => ({
    variables: {
      input: {
        ownerID: props.parentID,
        name: createForm.name,
        private: createForm.private,
      },
    },
  })
)
</script>
