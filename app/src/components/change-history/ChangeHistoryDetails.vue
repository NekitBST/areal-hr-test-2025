<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    header="Детальная информация об изменении"
    modal
    :style="{ width: '700px' }"
  >
    <div v-if="changeHistory" class="change-history-details">
      <div class="detail-item">
        <label>ID:</label>
        <span>{{ changeHistory.id }}</span>
      </div>

      <div class="detail-item">
        <label>Время операции:</label>
        <span>{{ new Date(changeHistory.created_at).toLocaleString() }}</span>
      </div>

      <div class="detail-item">
        <label>Кто изменил:</label>
        <span>{{ `${changeHistory.last_name} ${changeHistory.first_name}` }}</span>
      </div>

      <div class="detail-item">
        <label>Тип объекта:</label>
        <span>{{ getObjectTypeName(changeHistory.object_type) }}</span>
      </div>

      <div class="detail-item">
        <label>ID объекта:</label>
        <span>{{ changeHistory.object_id }}</span>
      </div>

      <div class="detail-item" v-if="changeHistory.old_value">
        <label>Старое значение:</label>
        <pre>{{ formatChangedValue(changeHistory.old_value) }}</pre>
      </div>

      <div class="detail-item" v-if="changeHistory.new_value">
        <label>Новое значение:</label>
        <pre>{{ formatChangedValue(changeHistory.new_value) }}</pre>
      </div>

      <div class="detail-item">
        <label>Создано:</label>
        <span>{{ new Date(changeHistory.created_at).toLocaleString() }}</span>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  changeHistory: {
    type: Object,
    required: true
  }
})

const objectTypeNames = {
  organization: 'Организация',
  department: 'Отдел',
  position: 'Должность',
  employee: 'Сотрудник',
  hr_operation: 'HR-операция',
  file: 'Файл',
  user: 'Пользователь'
}

const fieldTranslations = {
  id: 'ID',
  name: 'Название',
  created_at: 'Дата создания',
  updated_at: 'Дата обновления',
  deleted_at: 'Дата удаления',
  comment: 'Комментарий',
  
  last_name: 'Фамилия',
  first_name: 'Имя',
  middle_name: 'Отчество',
  date_of_birth: 'Дата рождения',
  passport_series: 'Серия паспорта',
  passport_number: 'Номер паспорта',
  passport_issue_date: 'Дата выдачи паспорта',
  passport_department_code: 'Код подразделения',
  passport_issued_by: 'Кем выдан',
  registration_area: 'Область регистрации',
  registration_city: 'Город регистрации',
  registration_street: 'Улица регистрации',
  registration_house: 'Дом',
  registration_building: 'Строение',
  registration_apartment: 'Квартира',
  
  employee_id: 'ID сотрудника',
  department_id: 'ID отдела',
  position_id: 'ID должности',
  action_date: 'Дата действия',
  salary: 'Зарплата',
  action: 'Действие',
  
  file_path: 'Путь к файлу',
  
  parent_id: 'ID родительского отдела',
  organization_id: 'ID организации',

  login: 'Логин',
  role_id: 'ID роли'
}

const fieldOrder = {
  user: [
    'id',
    'last_name',
    'first_name',
    'middle_name',
    'login',
    'role_id',
    'created_at',
    'updated_at',
    'deleted_at'
  ],
  employee: [
    'id',
    'last_name',
    'first_name',
    'middle_name',
    'date_of_birth',
    'passport_series',
    'passport_number',
    'passport_issue_date',
    'passport_department_code',
    'passport_issued_by',
    'registration_area',
    'registration_city',
    'registration_street',
    'registration_house',
    'registration_building',
    'registration_apartment',
    'created_at',
    'updated_at',
    'deleted_at'
  ],
  hr_operation: [
    'id',
    'employee_id',
    'department_id',
    'position_id',
    'action_date',
    'salary',
    'action',
    'created_at',
    'updated_at',
    'deleted_at'
  ],
  organization: [
    'id',
    'name',
    'comment',
    'created_at',
    'updated_at',
    'deleted_at'
  ],
  department: [
    'id',
    'name',
    'organization_id',
    'parent_id',
    'comment',
    'created_at',
    'updated_at',
    'deleted_at'
  ],
  position: [
    'id',
    'name',
    'created_at',
    'updated_at',
    'deleted_at'
  ],
  file: [
    'id',
    'name',
    'file_path',
    'employee_id',
    'created_at',
    'updated_at',
    'deleted_at'
  ]
}

const getObjectTypeName = (type) => objectTypeNames[type] || type

const formatChangedValue = (value) => {
  try {
    if (typeof value === 'string') return value
    
    const formattedValue = {}
    const objectType = props.changeHistory.object_type
    const orderArray = fieldOrder[objectType] || Object.keys(value)
    
    orderArray.forEach(key => {
      if (key in value) {
        const translatedKey = fieldTranslations[key] || key
        const val = value[key]
        if (val instanceof Date) {
          formattedValue[translatedKey] = new Date(val).toLocaleString()
        } else {
          formattedValue[translatedKey] = val
        }
      }
    })
    
    Object.entries(value).forEach(([key, val]) => {
      if (!orderArray.includes(key)) {
        const translatedKey = fieldTranslations[key] || key
        if (val instanceof Date) {
          formattedValue[translatedKey] = new Date(val).toLocaleString()
        } else {
          formattedValue[translatedKey] = val
        }
      }
    })
    
    return JSON.stringify(formattedValue, null, 2)
  } catch {
    return value
  }
}

defineEmits(['update:visible'])
</script>