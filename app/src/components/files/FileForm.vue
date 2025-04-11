<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Загрузить файл' : 'Редактировать файл'"
    modal
    :style="{ width: '450px' }"
  >
    <div class="form-group">
      <label for="name">Название*</label>
      <InputText
        id="name"
        v-model="formData.name"
        :class="{ 'p-invalid': errors?.name }"
      />
      <small class="p-error">{{ errors?.name }}</small>
    </div>

    <div class="form-group">
      <label for="employee">Сотрудник*</label>
      <div class="p-inputgroup">
        <Dropdown
          id="employee"
          v-model="formData.employee_id"
          :options="employees"
          optionLabel="full_name"
          optionValue="id"
          placeholder="Выберите сотрудника"
          :class="{ 'p-invalid': errors?.employee_id }"
        />
        <Button
          icon="pi pi-times"
          @click="formData.employee_id = null"
          :disabled="!formData.employee_id"
        />
      </div>
      <small class="p-error">{{ errors?.employee_id }}</small>
    </div>

    <div class="form-group">
      <label for="file">Файл{{ mode === 'create' ? '*' : '' }}</label>
      <div class="file-upload">
        <div class="custom-file-upload">
          <Button
            type="button"
            icon="pi pi-upload"
            :label="selectedFile ? 'Изменить файл' : 'Выбрать файл'"
            @click="$refs.fileInput.click()"
            severity="secondary"
            outlined
          />
          <span v-if="selectedFile" class="selected-file">
            {{ selectedFile.name }}
          </span>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            accept=".png,.jpg,.jpeg,.pdf"
            style="display: none"
          />
        </div>
        <small class="p-error">{{ errors?.file_path }}</small>
      </div>
      <FilePreview
        :selected-file="selectedFile"
        :file-path="file?.file_path"
        :file-preview="filePreview"
      />
    </div>

    <template #footer>
      <Button label="Отмена" icon="pi pi-times" text @click="onCancel" />
      <Button
        label="Сохранить"
        icon="pi pi-check"
        @click="onSave"
        :loading="loading"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import FilePreview from './FilePreview.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  mode: {
    type: String,
    required: true,
    validator: (value) => ['create', 'edit'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  file: {
    type: Object,
    default: () => ({})
  },
  employees: {
    type: Array,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'save', 'cancel'])

const fileInput = ref(null)
const selectedFile = ref(null)
const filePreview = ref(null)
const formData = reactive({
  name: '',
  employee_id: null,
  file: null
})

const isImage = computed(() => {
  if (!selectedFile.value) return false
  return ['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.value.type)
})

watch(() => props.file, (newVal) => {
  if (newVal) {
    formData.name = newVal.name || ''
    formData.employee_id = newVal.employee_id || null
  }
}, { immediate: true })

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    formData.name = ''
    formData.employee_id = null
    formData.file = null
    selectedFile.value = null
    filePreview.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
})

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    formData.file = file
    
    if (isImage.value) {
      const reader = new FileReader()
      reader.onload = (e) => {
        filePreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      filePreview.value = null
    }
  }
}

const onSave = () => {
  const data = new FormData()
  data.append('name', formData.name.trim())
  data.append('employee_id', formData.employee_id?.toString() || '')
  if (formData.file) {
    data.append('file_path', formData.file)
  }
  emit('save', props.mode === 'create' || formData.file ? data : {
    name: formData.name.trim(),
    employee_id: formData.employee_id
  })
}

const onCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}
</script>

<style scoped>
</style> 