<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Создать отдел' : 'Редактировать отдел'"
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
      <label for="organization">Организация*</label>
      <div class="p-inputgroup">
        <Dropdown
          id="organization"
          v-model="formData.organization_id"
          :options="organizations"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите организацию"
          :class="{ 'p-invalid': errors.organization_id }"
        />
        <Button
          icon="pi pi-times"
          @click="formData.organization_id = null"
          :disabled="!formData.organization_id"
        />
      </div>
      <small class="p-error">{{ errors.organization_id }}</small>
    </div>

    <div class="form-group">
      <label for="parent">Родительский отдел</label>
      <div class="p-inputgroup">
        <Dropdown
          id="parent"
          v-model="formData.parent_id"
          :options="availableDepartments"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите родительский отдел"
          :class="{ 'p-invalid': errors.parent_id }"
        />
        <Button
          icon="pi pi-times"
          @click="formData.parent_id = null"
          :disabled="!formData.parent_id"
        />
      </div>
      <small class="p-error">{{ errors.parent_id }}</small>
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
import { ref, reactive, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
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