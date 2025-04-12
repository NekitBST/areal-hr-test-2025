<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Создать HR-операцию' : 'Редактировать HR-операцию'"
    modal
    :style="{ width: '450px' }"
  >
    <div class="form-group">
      <label for="employee_id">Сотрудник*</label>
      <div class="p-inputgroup">
        <Dropdown
          id="employee_id"
          v-model="formData.employee_id"
          :options="employees"
          optionLabel="full_name"
          optionValue="id"
          placeholder="Выберите сотрудника"
          :class="{ 'p-invalid': errors.employee_id }"
        />
        <Button
          icon="pi pi-times"
          @click="formData.employee_id = null"
          :disabled="!formData.employee_id"
        />
      </div>
      <small class="p-error">{{ errors.employee_id }}</small>
    </div>

    <div class="form-group">
      <label for="department_id">Отдел*</label>
      <div class="p-inputgroup">
        <Dropdown
          id="department_id"
          v-model="formData.department_id"
          :options="departments"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите отдел"
          :class="{ 'p-invalid': errors.department_id }"
        />
        <Button
          icon="pi pi-times"
          @click="formData.department_id = null"
          :disabled="!formData.department_id"
        />
      </div>
      <small class="p-error">{{ errors.department_id }}</small>
    </div>

    <div class="form-group">
      <label for="position_id">Должность*</label>
      <div class="p-inputgroup">
        <Dropdown
          id="position_id"
          v-model="formData.position_id"
          :options="positions"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите должность"
          :class="{ 'p-invalid': errors.position_id }"
        />
        <Button
          icon="pi pi-times"
          @click="formData.position_id = null"
          :disabled="!formData.position_id"
        />
      </div>
      <small class="p-error">{{ errors.position_id }}</small>
    </div>

    <div class="form-group">
      <label for="action">Действие*</label>
      <Dropdown
        id="action"
        v-model="formData.action"
        :options="actions"
        placeholder="Выберите действие"
        :class="{ 'p-invalid': errors.action }"
      />
      <small class="p-error">{{ errors.action }}</small>
    </div>

    <div class="form-group">
      <label for="salary">Зарплата</label>
      <InputNumber
        id="salary"
        v-model="formData.salary"
        :min="0"
        :class="{ 'p-invalid': errors.salary }"
      />
      <small class="p-error">{{ errors.salary }}</small>
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
import { reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
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