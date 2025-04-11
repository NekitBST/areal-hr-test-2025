<template>
  <DataTable
    :value="files"
    :loading="loading"
    :paginator="true"
    :rows="10"
    stripedRows
    :selection="selectedFile"
    @update:selection="$emit('update:selectedFile', $event)"
    selectionMode="single"
    @row-select="onRowSelect"
    @row-unselect="onRowUnselect"
  >
    <Column field="id" header="ID" sortable />
    <Column field="name" header="Название" sortable>
      <template #body="{ data }">
        <span>{{ data.name.length > 15 ? data.name.slice(0, 15) + '...' : data.name }}</span>
      </template>
    </Column>
    <Column field="employee" header="Сотрудник" sortable>
      <template #body="{ data }">
        {{ getEmployeeFullName(data.employee_id) }}
      </template>
    </Column>
    <Column field="created_at" header="Создано" sortable>
      <template #body="{ data }">
        {{ new Date(data.created_at).toLocaleString() }}
      </template>
    </Column>
    <Column field="updated_at" header="Обновлено" sortable>
      <template #body="{ data }">
        {{ new Date(data.updated_at).toLocaleString() }}
      </template>
    </Column>
    <Column header="Действия">
      <template #body="{ data }">
        <div class="actions">
          <Button
            icon="pi pi-eye"
            text
            rounded
            severity="info"
            @click="$emit('view', data)"
          />
          <Button
            icon="pi pi-pencil"
            text
            rounded
            severity="info"
            @click="$emit('edit', data)"
          />
          <Button
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            @click="$emit('delete', data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

import { useEmployeesStore } from '../../stores/employees'


const props = defineProps({
  files: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedFile: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:selectedFile', 'row-select', 'row-unselect', 'view', 'edit', 'delete'])

const employeesStore = useEmployeesStore()

const getEmployeeFullName = (employeeId) => {
  const employee = employeesStore.employees.find(emp => emp.id === employeeId)
  return employee ? `${employee.last_name} ${employee.first_name}` : ''
}

const onRowSelect = (event) => {
  emit('row-select', event)
}

const onRowUnselect = () => {
  emit('row-unselect')
}
</script> 