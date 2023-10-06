<template>
  <va-button
    size="small"
    preset="secondary"
    color="danger"
    class="mr-2"
    @click="showDeleteModal"
    >Delete namespace</va-button
  >

  <va-modal
    v-model="isShowDeleteModal"
    title="Delete annotation namespace"
    no-outside-dismiss
    hide-default-actions
  >
    <div class="my-4">
      All annotations in this namespace should be removed first.
      <br />
      Delete annotation namespace {{ props.name }} ({{ props.id }})?
    </div>

    <template #footer>
      <va-button
        @click="closeDeleteModal"
        preset="outline"
        color="secondary"
        class="mr-3"
      >
        Cancel
      </va-button>

      <va-button type="submit" color="danger" @click="handleDelete">
        Delete namespace
      </va-button>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
import { ref } from "vue"

import { useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"

const props = defineProps({
  id: {
    type: String,
    default: "",
    required: true,
  },
  name: {
    type: String,
    default: "",
    required: true,
  },
})

const emit = defineEmits(["delete"])

const isShowDeleteModal = ref(false)

function showDeleteModal() {
  isShowDeleteModal.value = true
}

function closeDeleteModal() {
  isShowDeleteModal.value = false
}

function handleDelete() {
  deleteAnnotationNamespace()
  emit("delete")

  closeDeleteModal()
}

const { mutate: deleteAnnotationNamespace } = useMutation(
  gql`
    mutation deleteAnnotationNamespace($id: ID!) {
      annotationNamespaceDelete(id: $id) {
        deletedID
      }
    }
  `,
  () => ({
    variables: {
      id: props.id,
    },
  })
)
</script>
