<template>
  <va-button
    size="small"
    preset="secondary"
    color="danger"
    icon="delete"
    hover-behavior="opacity"
    :hover-opacity="0.1"
    @click="showDeleteModal"
    >Delete</va-button
  >

  <va-modal
    v-model="isShowDeleteModal"
    title="Delete annotation"
    no-outside-dismiss
    hide-default-actions
  >
    <div class="my-4">
      Delete {{ props.namespaceName }} annotation in node {{ props.nodeName }}?
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
        Delete annotation
      </va-button>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
import { ref } from "vue"

import { useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"

const props = defineProps({
  namespaceID: {
    type: String,
    default: "",
    required: true,
  },
  namespaceName: {
    type: String,
    default: "",
    required: true,
  },
  nodeID: {
    type: String,
    default: "",
    required: true,
  },
  nodeName: {
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
  deleteAnnotation()
  emit("delete")

  closeDeleteModal()
}

const { mutate: deleteAnnotation } = useMutation(
  gql`
    mutation deleteAnnotation($input: AnnotationDeleteInput!) {
      annotationDelete(input: $input) {
        deletedID
      }
    }
  `,
  () => ({
    variables: {
      input: {
        namespaceID: props.namespaceID,
        nodeID: props.nodeID,
      },
    },
  })
)
</script>
