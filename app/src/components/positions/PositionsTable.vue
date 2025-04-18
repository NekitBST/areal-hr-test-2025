<template>
  <DataTable
    :value="positions"
    :loading="loading"
    :paginator="true"
    :rows="10"
    stripedRows
    :selection="selectedPosition"
    @update:selection="$emit('update:selectedPosition', $event)"
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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { UIButton } from '../UI/ui-components'

const props = defineProps({
  positions: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedPosition: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:selectedPosition', 'row-select', 'row-unselect', 'view', 'edit', 'delete'])

const onRowSelect = (event) => {
  emit('row-select', event)
}

const onRowUnselect = () => {
  emit('row-unselect')
}
</script> 