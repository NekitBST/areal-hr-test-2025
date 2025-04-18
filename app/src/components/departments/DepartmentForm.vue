<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Создать отдел' : 'Редактировать отдел'"
    modal
    :style="{ width: '450px' }"
  >
    <UIInput
      id="name"
      v-model="formData.name"
      label="Название"
      :error="errors.name"
      required
    />

    <UIDropdown
      id="organization"
      v-model="formData.organization_id"
      :options="organizations"
      optionLabel="name"
      optionValue="id"
      placeholder="Выберите организацию"
      label="Организация"
      :error="errors.organization_id"
      :class="{ 'p-invalid': errors.organization_id }"
      required
    />

    <UIDropdown
      id="parent"
      v-model="formData.parent_id"
      :options="availableDepartments"
      optionLabel="name"
      optionValue="id"
      placeholder="Выберите родительский отдел"
      label="Родительский отдел"
      :error="errors.parent_id"
      :class="{ 'p-invalid': errors.parent_id }"
    />

    <UITextarea
      id="comment"
      v-model="formData.comment"
      label="Комментарий"
      :error="errors.comment"
      :rows="3"
    />

    <template #footer>
      <UIButton
        action="cancel"
        @click="onCancel"
      />
      <UIButton
        action="save"
        :loading="loading"
        @click="onSave"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import { UIInput, UITextarea, UIDropdown, UIButton } from '../UI/ui-components'

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
  department: {
    type: Object,
    default: () => ({})
  },
  organizations: {
    type: Array,
    required: true
  },
  departments: {
    type: Array,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'save', 'cancel'])

const formData = reactive({
  name: '',
  organization_id: null,
  parent_id: null,
  comment: ''
})

const availableDepartments = computed(() => 
  props.departments.filter(dep => dep.id !== props.department?.id)
)

watch(() => props.department, (newVal) => {
  if (newVal) {
    formData.name = newVal.name || ''
    formData.organization_id = newVal.organization_id || null
    formData.parent_id = newVal.parent_id || null
    formData.comment = newVal.comment || ''
  }
}, { immediate: true })

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    formData.name = ''
    formData.organization_id = null
    formData.parent_id = null
    formData.comment = ''
  }
})

const onSave = () => {
  emit('save', { ...formData })
}

const onCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}
</script> 