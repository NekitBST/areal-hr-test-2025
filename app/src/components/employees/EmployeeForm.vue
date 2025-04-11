<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Создать сотрудника' : 'Редактировать сотрудника'"
    modal
    :style="{ width: '600px' }"
  >
    <div class="form-group">
      <label for="last_name">Фамилия*</label>
      <InputText
        id="last_name"
        v-model="formData.last_name"
        :class="{ 'p-invalid': errors.last_name }"
      />
      <small class="p-error">{{ errors.last_name }}</small>
    </div>

    <div class="form-group">
      <label for="first_name">Имя*</label>
      <InputText
        id="first_name"
        v-model="formData.first_name"
        :class="{ 'p-invalid': errors.first_name }"
      />
      <small class="p-error">{{ errors.first_name }}</small>
    </div>

    <div class="form-group">
      <label for="middle_name">Отчество</label>
      <InputText
        id="middle_name"
        v-model="formData.middle_name"
        :class="{ 'p-invalid': errors.middle_name }"
      />
      <small class="p-error">{{ errors.middle_name }}</small>
    </div>

    <div class="form-group">
      <label for="date_of_birth">Дата рождения*</label>
      <Calendar
        id="date_of_birth"
        v-model="formData.date_of_birth"
        dateFormat="dd.mm.yy"
        :showIcon="true"
        iconDisplay="input"
        :class="{ 'p-invalid': errors.date_of_birth }"
      />
      <small class="p-error">{{ errors.date_of_birth }}</small>
    </div>

    <div class="form-group">
      <label for="passport_series">Серия паспорта</label>
      <InputText
        id="passport_series"
        v-model="formData.passport_series"
        :class="{ 'p-invalid': errors.passport_series }"
      />
      <small class="p-error">{{ errors.passport_series }}</small>
    </div>

    <div class="form-group">
      <label for="passport_number">Номер паспорта</label>
      <InputText
        id="passport_number"
        v-model="formData.passport_number"
        :class="{ 'p-invalid': errors.passport_number }"
      />
      <small class="p-error">{{ errors.passport_number }}</small>
    </div>

    <div class="form-group">
      <label for="passport_issue_date">Дата выдачи паспорта</label>
      <Calendar
        id="passport_issue_date"
        v-model="formData.passport_issue_date"
        dateFormat="dd.mm.yy"
        :showIcon="true"
        iconDisplay="input"
        :class="{ 'p-invalid': errors.passport_issue_date }"
      />
      <small class="p-error">{{ errors.passport_issue_date }}</small>
    </div>

    <div class="form-group">
      <label for="passport_department_code">Код подразделения</label>
      <InputText
        id="passport_department_code"
        v-model="formData.passport_department_code"
        :class="{ 'p-invalid': errors.passport_department_code }"
      />
      <small class="p-error">{{ errors.passport_department_code }}</small>
    </div>

    <div class="form-group">
      <label for="passport_issued_by">Кем выдан паспорт</label>
      <InputText
        id="passport_issued_by"
        v-model="formData.passport_issued_by"
        :class="{ 'p-invalid': errors.passport_issued_by }"
      />
      <small class="p-error">{{ errors.passport_issued_by }}</small>
    </div>

    <div class="form-group">
      <label for="registration_area">Область/край/республика</label>
      <InputText
        id="registration_area"
        v-model="formData.registration_area"
        :class="{ 'p-invalid': errors.registration_area }"
      />
      <small class="p-error">{{ errors.registration_area }}</small>
    </div>

    <div class="form-group">
      <label for="registration_city">Город</label>
      <InputText
        id="registration_city"
        v-model="formData.registration_city"
        :class="{ 'p-invalid': errors.registration_city }"
      />
      <small class="p-error">{{ errors.registration_city }}</small>
    </div>

    <div class="form-group">
      <label for="registration_street">Улица</label>
      <InputText
        id="registration_street"
        v-model="formData.registration_street"
        :class="{ 'p-invalid': errors.registration_street }"
      />
      <small class="p-error">{{ errors.registration_street }}</small>
    </div>

    <div class="form-group">
      <label for="registration_house">Номер дома</label>
      <InputText
        id="registration_house"
        v-model="formData.registration_house"
        :class="{ 'p-invalid': errors.registration_house }"
      />
      <small class="p-error">{{ errors.registration_house }}</small>
    </div>

    <div class="form-group">
      <label for="registration_building">Корпус/строение</label>
      <InputText
        id="registration_building"
        v-model="formData.registration_building"
        :class="{ 'p-invalid': errors.registration_building }"
      />
      <small class="p-error">{{ errors.registration_building }}</small>
    </div>

    <div class="form-group">
      <label for="registration_apartment">Номер квартиры</label>
      <InputText
        id="registration_apartment"
        v-model="formData.registration_apartment"
        :class="{ 'p-invalid': errors.registration_apartment }"
      />
      <small class="p-error">{{ errors.registration_apartment }}</small>
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
import Calendar from 'primevue/calendar'
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