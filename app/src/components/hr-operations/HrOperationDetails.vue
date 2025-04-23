<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    header="Детальная информация о HR-операции"
    modal
    :style="{ width: '600px' }"
  >
    <div v-if="hrOperation" class="hr-operation-details">
      <div class="detail-item">
        <label>ID:</label>
        <span>{{ hrOperation.id }}</span>
      </div>
      
      <div class="detail-item">
        <label>Сотрудник:</label>
        <span>{{ employeeFullName }}</span>
      </div>

      <div class="detail-item">
        <label>Отдел:</label>
        <span>{{ departmentName }}</span>
      </div>

      <div class="detail-item">
        <label>Должность:</label>
        <span>{{ positionName }}</span>
      </div>

      <div class="detail-item" v-if="hrOperation.salary">
        <label>Зарплата:</label>
        <span>{{ hrOperation.salary }} ₽</span>
      </div>

      <div class="detail-item">
        <label>Дата действия:</label>
        <span>{{ new Date(hrOperation.action_date).toLocaleString() }}</span>
      </div>

      <div class="detail-item">
        <label>Действие:</label>
        <span>{{ hrOperation.action }}</span>
      </div>

      <div class="detail-item">
        <label>Создано:</label>
        <span>{{ new Date(hrOperation.created_at).toLocaleString() }}</span>
      </div>

      <div class="detail-item">
        <label>Обновлено:</label>
        <span>{{ new Date(hrOperation.updated_at).toLocaleString() }}</span>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import { useEmployeesStore } from '../../stores/employees'
import { useDepartmentsStore } from '../../stores/departments'
import { usePositionsStore } from '../../stores/positions'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  hrOperation: {
    type: Object,
    required: true
  }
})

const employeesStore = useEmployeesStore()
const departmentsStore = useDepartmentsStore()
const positionsStore = usePositionsStore()

const employeeFullName = computed(() => {
  if (!props.hrOperation?.employee_id) return ''
  const employee = employeesStore.employees.find(emp => emp.id === props.hrOperation.employee_id)
  return employee ? `${employee.last_name} ${employee.first_name}` : ''
})

const departmentName = computed(() => {
  if (!props.hrOperation?.department_id) return ''
  const department = departmentsStore.departments.find(dep => dep.id === props.hrOperation.department_id)
  return department ? department.name : ''
})

const positionName = computed(() => {
  if (!props.hrOperation?.position_id) return ''
  const position = positionsStore.positions.find(pos => pos.id === props.hrOperation.position_id)
  return position ? position.name : ''
})

defineEmits(['update:visible'])
</script> 