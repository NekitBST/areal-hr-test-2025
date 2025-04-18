<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Создать HR-операцию' : 'Редактировать HR-операцию'"
    modal
    :style="{ width: '450px' }"
  >
    <UIDropdown
      id="employee_id"
      v-model="formData.employee_id"
      :options="employees"
      optionLabel="full_name"
      optionValue="id"
      placeholder="Выберите сотрудника"
      label="Сотрудник"
      :error="errors.employee_id"
      required
    />

    <UIDropdown
      id="department_id"
      v-model="formData.department_id"
      :options="departments"
      optionLabel="name"
      optionValue="id"
      placeholder="Выберите отдел"
      label="Отдел"
      :error="errors.department_id"
      required
    />

    <UIDropdown
      id="position_id"
      v-model="formData.position_id"
      :options="positions"
      optionLabel="name"
      optionValue="id"
      placeholder="Выберите должность"
      label="Должность"
      :error="errors.position_id"
      required
    />

    <UIDropdown
      id="action"
      v-model="formData.action"
      :options="actions"
      placeholder="Выберите действие"
      label="Действие"
      :error="errors.action"
      required
    />

    <UIInput
      id="salary"
      v-model="formData.salary"
      type="number"
      label="Зарплата"
      :error="errors.salary"
      min="0"
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
import { reactive, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import { UIInput, UIDropdown, UIButton } from '../UI/ui-components'

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
  hrOperation: {
    type: Object,
    default: () => ({})
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  employees: {
    type: Array,
    required: true
  },
  departments: {
    type: Array,
    required: true
  },
  positions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'save', 'cancel'])

const actions = [
  'Прием на работу',
  'Увольнение',
  'Перевод',
  'Изменение зарплаты'
]

const formData = reactive({
  employee_id: null,
  department_id: null,
  position_id: null,
  action: '',
  salary: null
})

watch(() => props.hrOperation, (newVal) => {
  if (newVal) {
    formData.employee_id = newVal.employee_id
    formData.department_id = newVal.department_id
    formData.position_id = newVal.position_id
    formData.action = newVal.action || ''
    formData.salary = newVal.salary
  }
}, { immediate: true })

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    formData.employee_id = null
    formData.department_id = null
    formData.position_id = null
    formData.action = ''
    formData.salary = null
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