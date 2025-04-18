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
        <pre>{{ formatValue(changeHistory.old_value) }}</pre>
      </div>

      <div class="detail-item" v-if="changeHistory.new_value">
        <label>Новое значение:</label>
        <pre>{{ formatValue(changeHistory.new_value) }}</pre>
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

const getObjectTypeName = (type) => objectTypeNames[type] || type

const formatValue = (value) => {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  } catch {
    return value
  }
}

defineEmits(['update:visible'])
</script> 