<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Создать организацию' : 'Редактировать организацию'"
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
import { reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'
import { UIInput, UITextarea, UIButton } from '../UI/ui-components'

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
  organization: {
    type: Object,
    default: () => ({})
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'save', 'cancel'])

const formData = reactive({
  name: '',
  comment: ''
})

watch(() => props.organization, (newVal) => {
  if (newVal) {
    formData.name = newVal.name || ''
    formData.comment = newVal.comment || ''
  }
}, { immediate: true })

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    formData.name = ''
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