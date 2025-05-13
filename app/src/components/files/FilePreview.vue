<template>
  <div class="file-preview" v-if="filePath || selectedFile">
    <template v-if="selectedFile">
      <img
        v-if="isImage"
        :src="filePreview"
        :alt="selectedFile.name"
        style="max-width: 100%; max-height: 200px;"
      />
      <div v-else class="pdf-preview">
        <i class="pi pi-file-pdf" style="font-size: 2rem"></i>
        <span>{{ selectedFile.name }}</span>
      </div>
    </template>
    <template v-else-if="filePath">
      <img
        v-if="isCurrentFileImage"
        :src="fileUrl"
        alt="Current file"
        style="max-width: 100%; max-height: 200px;"
      />
      <div v-else-if="isPdf" class="pdf-preview">
        <i class="pi pi-file-pdf" style="font-size: 2rem"></i>
        <Button
          v-if="showOpenButton"
          label="Открыть PDF"
          icon="pi pi-external-link"
          @click="openFile"
        />
        <span v-else>Текущий файл</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  filePath: {
    type: String,
    default: null
  },
  selectedFile: {
    type: File,
    default: null
  },
  filePreview: {
    type: String,
    default: null
  },
  showOpenButton: {
    type: Boolean,
    default: false
  }
})

const fileUrl = computed(() => {
  if (!props.filePath) return null
  const isDevelopment = import.meta.env.MODE === 'development'
  const baseURL = isDevelopment
    ? `http://${import.meta.env.VITE_DB_HOST}:${import.meta.env.VITE_PORT}`
    : ''
  const path = props.filePath.startsWith('/') ? props.filePath.slice(1) : props.filePath
  return `${baseURL}/${path}`
})

const isImage = computed(() => {
  if (!props.selectedFile) return false
  return ['image/jpeg', 'image/png', 'image/jpg'].includes(props.selectedFile.type)
})

const isCurrentFileImage = computed(() => {
  if (!props.filePath) return false
  return /\.(jpg|jpeg|png)$/i.test(props.filePath)
})

const isPdf = computed(() => {
  if (!props.filePath) return false
  return /\.pdf$/i.test(props.filePath)
})

const openFile = () => {
  if (fileUrl.value) {
    window.open(fileUrl.value, '_blank')
  }
}
</script> 