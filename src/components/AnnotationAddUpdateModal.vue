<template>
  <va-button
    v-if="props.operation === 'Add'"
    size="small"
    icon="add"
    preset="secondary"
    hover-behavior="opacity"
    :hover-opacity="0.1"
    @click="showUpdateModal"
    >Create annotation</va-button
  >
  <va-button
    v-else-if="props.operation === 'Update'"
    size="small"
    icon="edit"
    preset="secondary"
    hover-behavior="opacity"
    :hover-opacity="0.1"
    @click="showUpdateModal"
    >Update</va-button
  >

  <va-modal
    v-model="isShowUpdateModal"
    :title="props.operation + ' annotation'"
    no-outside-dismiss
    hide-default-actions
  >
    <va-form ref="refUpdateForm" class="my-4">
      <div class="mb-4">
        {{ props.operation }} annotation for node {{ props.nodeName }}.
      </div>

      <va-input
        label="Namespace"
        :model-value="props.namespaceName"
        class="mb-3"
        readonly
      />

      <va-input
        label="Data"
        type="textarea"
        placeholder="Enter properly formatted JSON here"
        :min-rows="4"
        :max-rows="10"
        autosize
        v-model.trim="data"
        :rules="[validateData]"
      />
    </va-form>

    <template #footer>
      <va-button
        @click="closeUpdateModal"
        preset="outline"
        color="secondary"
        class="mr-3"
      >
        Cancel
      </va-button>

      <va-button type="submit" @click="handleUpdate">
        {{ props.operation }} annotation
      </va-button>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
import { ref } from "vue"

import { useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"

const props = defineProps({
  operation: {
    // Add or Update
    type: String,
    default: "Add",
    required: true,
  },
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
  annotation: {
    type: Object,
    required: false,
  },
})

const emit = defineEmits(["update"])

const refUpdateForm = ref()
const isShowUpdateModal = ref(false)

const data = ref("")

function showUpdateModal() {
  data.value = JSON.stringify(props.annotation, null, 2)
  isShowUpdateModal.value = true
}

function closeUpdateModal() {
  isShowUpdateModal.value = false
}

function validateData(value: string) {
  try {
    JSON.parse(value)
  } catch (e) {
    return "Invalid JSON"
  }

  return true
}

function handleUpdate() {
  if (!refUpdateForm.value.validate()) {
    return
  }

  updateAnnotation()
  emit("update")

  closeUpdateModal()
}

const { mutate: updateAnnotation } = useMutation(
  gql`
    mutation updateAnnotation($input: AnnotationUpdateInput!) {
      annotationUpdate(input: $input) {
        annotation {
          id
        }
      }
    }
  `,
  () => ({
    variables: {
      input: {
        namespaceID: props.namespaceID,
        nodeID: props.nodeID,
        data: data.value,
      },
    },
  })
)
</script>
