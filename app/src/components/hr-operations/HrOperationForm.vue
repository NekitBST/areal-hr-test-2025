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
      v-if="showField.department"
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
      v-if="showField.position"
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
      v-if="showField.salary"
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
import { useHrOperationsStore } from '../../stores/hr-operations'

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

const hrOperationsStore = useHrOperationsStore()

const formData = reactive({
  employee_id: null,
  department_id: null,
  position_id: null,
  action: '',
  salary: null
})

const availableActions = computed(() => {
  if (props.mode === 'edit') {
    const currentAction = props.hrOperation?.action
    if (currentAction) {
      return [currentAction]
    }
  }

  if (!formData.employee_id) return ['Прием на работу']
  
  const lastOperation = hrOperationsStore.getLastEmployeeOperation(formData.employee_id)
  if (!lastOperation) return ['Прием на работу']
  
  if (lastOperation.action === 'Увольнение') {
    return ['Прием на работу']
  }
  
  if (lastOperation.action === 'Прием на работу' || 
      lastOperation.action === 'Перевод' || 
      lastOperation.action === 'Изменение зарплаты') {
    return ['Увольнение', 'Перевод', 'Изменение зарплаты']
  }
  
  return ['Прием на работу']
})

const showField = computed(() => ({
  employee: true,
  department: formData.action !== 'Увольнение' && formData.action !== 'Изменение зарплаты',
  position: formData.action !== 'Увольнение' && formData.action !== 'Изменение зарплаты',
  salary: ['Прием на работу', 'Перевод', 'Изменение зарплаты'].includes(formData.action)
}))

const actions = computed(() => availableActions.value)

watch(() => props.hrOperation, (newVal) => {
  if (newVal) {
    formData.employee_id = newVal.employee_id
    formData.department_id = newVal.department_id
    formData.position_id = newVal.position_id
    formData.action = newVal.action
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

watch(() => formData.employee_id, (newVal) => {
  if (props.mode === 'create' && newVal) {
    const lastOperation = hrOperationsStore.getLastEmployeeOperation(newVal)
    if (lastOperation && lastOperation.action === 'Увольнение') {
      formData.action = 'Прием на работу'
    } else if (!lastOperation) {
      formData.action = 'Прием на работу'
    }

    if (lastOperation && lastOperation.action !== 'Увольнение') {
      formData.department_id = lastOperation.department_id
      formData.position_id = lastOperation.position_id
      formData.salary = lastOperation.salary
    }
  }
})

watch(() => formData.action, (newVal) => {
  if (newVal === 'Изменение зарплаты') {
    const lastOperation = hrOperationsStore.getLastEmployeeOperation(formData.employee_id)
    if (lastOperation && lastOperation.action !== 'Увольнение') {
      formData.department_id = lastOperation.department_id
      formData.position_id = lastOperation.position_id
    }
  }
})

const onSave = () => {
  const dataToSave = { ...formData }
  
  if (formData.action === 'Изменение зарплаты' && (!formData.department_id || !formData.position_id)) {
    const lastOperation = hrOperationsStore.getLastEmployeeOperation(formData.employee_id)
    if (lastOperation && lastOperation.action !== 'Увольнение') {
      dataToSave.department_id = lastOperation.department_id
      dataToSave.position_id = lastOperation.position_id
    }
  }

  emit('save', dataToSave)
}

const onCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}
</script> 