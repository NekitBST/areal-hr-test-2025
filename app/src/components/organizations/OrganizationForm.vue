<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Создать организацию' : 'Редактировать организацию'"
    modal
    :style="{ width: '450px' }"
  >
    <div class="form-group">
      <label for="name">Название*</label>
      <InputText
        id="name"
        v-model="formData.name"
        :class="{ 'p-invalid': errors.name }"
      />
      <small class="p-error">{{ errors.name }}</small>
    </div>

    <div class="form-group">
      <label for="comment">Комментарий</label>
      <Textarea
        id="comment"
        v-model="formData.comment"
        rows="3"
        :class="{ 'p-invalid': errors.comment }"
      />
      <small class="p-error">{{ errors.comment }}</small>
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
import { ref, reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

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