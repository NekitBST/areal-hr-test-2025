<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    header="Детальная информация о сотруднике"
    modal
    :style="{ width: '600px' }"
  >
    <div v-if="employee" class="employee-details">
      <div class="detail-item">
        <label>ID:</label>
        <span>{{ employee.id }}</span>
      </div>
      <div class="detail-item">
        <label>Фамилия:</label>
        <span>{{ employee.last_name }}</span>
      </div>
      <div class="detail-item">
        <label>Имя:</label>
        <span>{{ employee.first_name }}</span>
      </div>
      <div class="detail-item" v-if="employee.middle_name">
        <label>Отчество:</label>
        <span>{{ employee.middle_name }}</span>
      </div>
      <div class="detail-item">
        <label>Дата рождения:</label>
        <span>{{ new Date(employee.date_of_birth).toLocaleDateString() }}</span>
      </div>
      
      <div v-if="hasPassportData" class="section-title">Паспортные данные</div>
      
      <div class="detail-item" v-if="employee.passport_series">
        <label>Серия паспорта:</label>
        <span>{{ employee.passport_series }}</span>
      </div>
      <div class="detail-item" v-if="employee.passport_number">
        <label>Номер паспорта:</label>
        <span>{{ employee.passport_number }}</span>
      </div>
      <div class="detail-item" v-if="employee.passport_issue_date">
        <label>Дата выдачи паспорта:</label>
        <span>{{ new Date(employee.passport_issue_date).toLocaleDateString() }}</span>
      </div>
      <div class="detail-item" v-if="employee.passport_department_code">
        <label>Код подразделения:</label>
        <span>{{ employee.passport_department_code }}</span>
      </div>
      <div class="detail-item" v-if="employee.passport_issued_by">
        <label>Кем выдан паспорт:</label>
        <span>{{ employee.passport_issued_by }}</span>
      </div>
      
      <div v-if="hasRegistrationData" class="section-title">Адрес регистрации</div>
      
      <div class="detail-item" v-if="employee.registration_area">
        <label>Область/край/республика:</label>
        <span>{{ employee.registration_area }}</span>
      </div>
      <div class="detail-item" v-if="employee.registration_city">
        <label>Город:</label>
        <span>{{ employee.registration_city }}</span>
      </div>
      <div class="detail-item" v-if="employee.registration_street">
        <label>Улица:</label>
        <span>{{ employee.registration_street }}</span>
      </div>
      <div class="detail-item" v-if="employee.registration_house">
        <label>Номер дома:</label>
        <span>{{ employee.registration_house }}</span>
      </div>
      <div class="detail-item" v-if="employee.registration_building">
        <label>Корпус/строение:</label>
        <span>{{ employee.registration_building }}</span>
      </div>
      <div class="detail-item" v-if="employee.registration_apartment">
        <label>Номер квартиры:</label>
        <span>{{ employee.registration_apartment }}</span>
      </div>
      
      <div class="detail-item">
        <label>Создано:</label>
        <span>{{ new Date(employee.created_at).toLocaleString() }}</span>
      </div>
      <div class="detail-item">
        <label>Обновлено:</label>
        <span>{{ new Date(employee.updated_at).toLocaleString() }}</span>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  employee: {
    type: Object,
    required: true
  }
})

defineEmits(['update:visible'])

const hasPassportData = computed(() => {
  return props.employee && (
    props.employee.passport_series ||
    props.employee.passport_number ||
    props.employee.passport_issue_date ||
    props.employee.passport_department_code ||
    props.employee.passport_issued_by
  )
})

const hasRegistrationData = computed(() => {
  return props.employee && (
    props.employee.registration_area ||
    props.employee.registration_city ||
    props.employee.registration_street ||
    props.employee.registration_house ||
    props.employee.registration_building ||
    props.employee.registration_apartment
  )
})
</script> 