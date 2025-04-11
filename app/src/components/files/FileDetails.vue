<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    header="Детальная информация"
    modal
    :style="{ width: '500px' }"
    :closable="true"
    :closeOnEscape="true"
  >
    <div class="details" v-if="file">
      <div class="detail-item" v-if="file.id">
        <label>ID:</label>
        <span>{{ file.id }}</span>
      </div>
      
      <div class="detail-item" v-if="file.name">
        <label>Название:</label>
        <span>{{ file.name }}</span>
      </div>

      <div class="detail-item" v-if="file.file_path">
        <label>Путь к файлу:</label>
        <span>{{ file.file_path }}</span>
      </div>

      <div class="detail-item" v-if="employeeFullName">
        <label>Сотрудник:</label>
        <span>{{ employeeFullName }}</span>
      </div>

      <div class="detail-item" v-if="file.created_at">
        <label>Создано:</label>
        <span>{{ new Date(file.created_at).toLocaleString() }}</span>
      </div>

      <div class="detail-item" v-if="file.updated_at">
        <label>Обновлено:</label>
        <span>{{ new Date(file.updated_at).toLocaleString() }}</span>
      </div>

      <FilePreview
        v-if="file.file_path"
        :file-path="file.file_path"
        :show-open-button="true"
      />
    </div>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import FilePreview from './FilePreview.vue'
import { useEmployeesStore } from '../../stores/employees'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  file: {
    type: Object,
    default: null
  }
})

const employeesStore = useEmployeesStore()

const employeeFullName = computed(() => {
  if (!props.file?.employee_id) return ''
  const employee = employeesStore.employees.find(emp => emp.id === props.file.employee_id)
  return employee ? `${employee.last_name} ${employee.first_name}` : ''
})

defineEmits(['update:visible'])
</script>

<style scoped>
</style> 