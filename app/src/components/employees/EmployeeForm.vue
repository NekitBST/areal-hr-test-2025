<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Создать сотрудника' : 'Редактировать сотрудника'"
    modal
    :style="{ width: '600px' }"
  >
    <UIInput
      id="last_name"
      v-model="formData.last_name"
      label="Фамилия"
      :error="errors.last_name"
      required
    />

    <UIInput
      id="first_name"
      v-model="formData.first_name"
      label="Имя"
      :error="errors.first_name"
      required
    />

    <UIInput
      id="middle_name"
      v-model="formData.middle_name"
      label="Отчество"
      :error="errors.middle_name"
    />

    <UICalendar
      id="date_of_birth"
      v-model="formData.date_of_birth"
      label="Дата рождения"
      :error="errors.date_of_birth"
      required
    />

    <UIInput
      id="passport_series"
      v-model="formData.passport_series"
      label="Серия паспорта"
      :error="errors.passport_series"
    />

    <UIInput
      id="passport_number"
      v-model="formData.passport_number"
      label="Номер паспорта"
      :error="errors.passport_number"
    />

    <UICalendar
      id="passport_issue_date"
      v-model="formData.passport_issue_date"
      label="Дата выдачи паспорта"
      :error="errors.passport_issue_date"
    />

    <UIInput
      id="passport_department_code"
      v-model="formData.passport_department_code"
      label="Код подразделения"
      :error="errors.passport_department_code"
    />

    <UIInput
      id="passport_issued_by"
      v-model="formData.passport_issued_by"
      label="Кем выдан паспорт"
      :error="errors.passport_issued_by"
    />

    <UIInput
      id="registration_area"
      v-model="formData.registration_area"
      label="Область/край/республика"
      :error="errors.registration_area"
    />

    <UIInput
      id="registration_city"
      v-model="formData.registration_city"
      label="Город"
      :error="errors.registration_city"
    />

    <UIInput
      id="registration_street"
      v-model="formData.registration_street"
      label="Улица"
      :error="errors.registration_street"
    />

    <UIInput
      id="registration_house"
      v-model="formData.registration_house"
      label="Номер дома"
      :error="errors.registration_house"
    />

    <UIInput
      id="registration_building"
      v-model="formData.registration_building"
      label="Корпус/строение"
      :error="errors.registration_building"
    />

    <UIInput
      id="registration_apartment"
      v-model="formData.registration_apartment"
      label="Номер квартиры"
      :error="errors.registration_apartment"
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
import { ref, reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'
import { UIInput, UICalendar, UIButton } from '../UI/ui-components'

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
  employee: {
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
  last_name: '',
  first_name: '',
  middle_name: '',
  date_of_birth: null,
  passport_series: '',
  passport_number: '',
  passport_issue_date: null,
  passport_department_code: '',
  passport_issued_by: '',
  registration_area: '',
  registration_city: '',
  registration_street: '',
  registration_house: '',
  registration_building: '',
  registration_apartment: ''
})

watch(() => props.employee, (newVal) => {
  if (newVal) {
    formData.last_name = newVal.last_name || ''
    formData.first_name = newVal.first_name || ''
    formData.middle_name = newVal.middle_name || ''
    formData.date_of_birth = newVal.date_of_birth ? new Date(newVal.date_of_birth) : null
    formData.passport_series = newVal.passport_series || ''
    formData.passport_number = newVal.passport_number || ''
    formData.passport_issue_date = newVal.passport_issue_date ? new Date(newVal.passport_issue_date) : null
    formData.passport_department_code = newVal.passport_department_code || ''
    formData.passport_issued_by = newVal.passport_issued_by || ''
    formData.registration_area = newVal.registration_area || ''
    formData.registration_city = newVal.registration_city || ''
    formData.registration_street = newVal.registration_street || ''
    formData.registration_house = newVal.registration_house || ''
    formData.registration_building = newVal.registration_building || ''
    formData.registration_apartment = newVal.registration_apartment || ''
  }
}, { immediate: true })

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    formData.last_name = ''
    formData.first_name = ''
    formData.middle_name = ''
    formData.date_of_birth = null
    formData.passport_series = ''
    formData.passport_number = ''
    formData.passport_issue_date = null
    formData.passport_department_code = ''
    formData.passport_issued_by = ''
    formData.registration_area = ''
    formData.registration_city = ''
    formData.registration_street = ''
    formData.registration_house = ''
    formData.registration_building = ''
    formData.registration_apartment = ''
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