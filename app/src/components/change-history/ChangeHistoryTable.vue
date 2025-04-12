<template>
  <DataTable
    :value="changeHistory"
    :loading="loading"
    :paginator="true"
    :rows="10"
    stripedRows
    :selection="selectedChangeHistory"
    @update:selection="$emit('update:selectedChangeHistory', $event)"
    selectionMode="single"
    @row-select="onRowSelect"
    @row-unselect="onRowUnselect"
  >
    <Column field="id" header="ID" sortable />
    <Column field="operation_time" header="Время операции" sortable>
      <template #body="{ data }">
        {{ new Date(data.created_at).toLocaleString() }}
      </template>
    </Column>
    <Column field="changed_by" header="Кто изменил" sortable>
      <template #body="{ data }">
        {{ `${data.last_name} ${data.first_name}` }}
      </template>
    </Column>
    <Column field="object_type" header="Тип объекта" sortable>
      <template #body="{ data }">
        {{ getObjectTypeName(data.object_type) }}
      </template>
    </Column>
    <Column field="object_id" header="ID объекта" sortable />
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
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const props = defineProps({
  changeHistory: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedChangeHistory: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:selectedChangeHistory', 'row-select', 'row-unselect', 'view'])

const objectTypeNames = {
  organization: 'Организация',
  department: 'Отдел',
  position: 'Должность',
  employee: 'Сотрудник',
  hr_operation: 'HR-операция',
  file: 'Файл'
}

const getObjectTypeName = (type) => objectTypeNames[type] || type

const onRowSelect = (event) => {
  emit('row-select', event)
}

const onRowUnselect = () => {
  emit('row-unselect')
}
</script> 