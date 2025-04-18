<template>
  <DataTable
    :value="hrOperations"
    :loading="loading"
    :paginator="true"
    :rows="10"
    stripedRows
    :selection="selectedHrOperation"
    @update:selection="$emit('update:selectedHrOperation', $event)"
    selectionMode="single"
    @row-select="onRowSelect"
    @row-unselect="onRowUnselect"
  >
    <Column field="id" header="ID" sortable />
    <Column field="employee_id" header="Сотрудник" sortable>
      <template #body="{ data }">
        {{ getEmployeeFullName(data.employee_id) }}
      </template>
    </Column>
    <Column field="department_id" header="Отдел" sortable>
      <template #body="{ data }">
        {{ getDepartmentName(data.department_id) }}
      </template>
    </Column>
    <Column field="position_id" header="Должность" sortable>
      <template #body="{ data }">
        {{ getPositionName(data.position_id) }}
      </template>
    </Column>
    <Column field="action_date" header="Дата действия" sortable>
      <template #body="{ data }">
        {{ new Date(data.action_date).toLocaleString() }}
      </template>
    </Column>
    <Column field="salary" header="Зарплата" sortable>
      <template #body="{ data }">
        {{ data.salary ? `${data.salary} ₽` : '-' }}
      </template>
    </Column>
    <Column field="action" header="Действие" sortable />
    <Column field="updated_at" header="Обновлено" sortable>
      <template #body="{ data }">
        {{ new Date(data.updated_at).toLocaleString() }}
      </template>
    </Column>
    <Column header="Действия">
      <template #body="{ data }">
        <div class="actions">
          <UIButton
            action="view"
            @click="$emit('view', data)"
          />
          <UIButton
            action="edit"
            @click="$emit('edit', data)"
          />
          <UIButton
            action="delete"
            @click="$emit('delete', data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { UIButton } from '../UI/ui-components'
import { useEmployeesStore } from '../../stores/employees'
import { useDepartmentsStore } from '../../stores/departments'
import { usePositionsStore } from '../../stores/positions'

const props = defineProps({
  hrOperations: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedHrOperation: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:selectedHrOperation', 'row-select', 'row-unselect', 'view', 'edit', 'delete'])

const employeesStore = useEmployeesStore()
const departmentsStore = useDepartmentsStore()
const positionsStore = usePositionsStore()

const getEmployeeFullName = (employeeId) => {
  const employee = employeesStore.employees.find(emp => emp.id === employeeId)
  return employee ? `${employee.last_name} ${employee.first_name}` : ''
}

const getDepartmentName = (departmentId) => {
  const department = departmentsStore.departments.find(dep => dep.id === departmentId)
  return department ? department.name : ''
}

const getPositionName = (positionId) => {
  const position = positionsStore.positions.find(pos => pos.id === positionId)
  return position ? position.name : ''
}

const onRowSelect = (event) => {
  emit('row-select', event)
}

const onRowUnselect = () => {
  emit('row-unselect')
}
</script> 