<template>
  <DataTable
    :value="employees"
    :loading="loading"
    :paginator="true"
    :rows="10"
    stripedRows
    :selection="selectedEmployee"
    @update:selection="$emit('update:selectedEmployee', $event)"
    selectionMode="single"
    @row-select="onRowSelect"
    @row-unselect="onRowUnselect"
  >
    <Column field="id" header="ID" sortable />
    <Column field="last_name" header="Фамилия" sortable>
      <template #body="{ data }">
        <span>{{ data.last_name.length > 15 ? data.last_name.slice(0, 15) + '...' : data.last_name }}</span>
      </template>
    </Column>
    <Column field="first_name" header="Имя" sortable>
      <template #body="{ data }">
        <span>{{ data.first_name.length > 15 ? data.first_name.slice(0, 15) + '...' : data.first_name }}</span>
      </template>
    </Column>
    <Column field="date_of_birth" header="Дата рождения" sortable>
      <template #body="{ data }">
        {{ new Date(data.date_of_birth).toLocaleDateString() }}
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
import { computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const props = defineProps({
  employees: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedEmployee: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:selectedEmployee', 'row-select', 'row-unselect', 'view', 'edit', 'delete'])

const onRowSelect = (event) => {
  emit('row-select', event)
}

const onRowUnselect = () => {
  emit('row-unselect')
}
</script> 