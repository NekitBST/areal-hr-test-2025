<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    header="Детальная информация об отделе"
    modal
    :style="{ width: '600px' }"
  >
    <div v-if="department" class="department-details">
      <div class="detail-item">
        <label>ID:</label>
        <span>{{ department.id }}</span>
      </div>
      <div class="detail-item">
        <label>Название:</label>
        <span>{{ department.name }}</span>
      </div>
      <div class="detail-item">
        <label>Организация:</label>
        <span>{{ getOrganizationName(department.organization_id) }}</span>
      </div>
      <div class="detail-item" v-if="department.parent_id">
        <label>Родительский отдел:</label>
        <span>{{ getDepartmentName(department.parent_id) }}</span>
      </div>
      <div class="detail-item" v-if="department.comment">
        <label>Комментарий:</label>
        <span>{{ department.comment }}</span>
      </div>
      <div class="detail-item">
        <label>Создано:</label>
        <span>{{ new Date(department.created_at).toLocaleString() }}</span>
      </div>
      <div class="detail-item">
        <label>Обновлено:</label>
        <span>{{ new Date(department.updated_at).toLocaleString() }}</span>
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
  department: {
    type: Object,
    required: true
  },
  organizations: {
    type: Array,
    required: true
  },
  departments: {
    type: Array,
    required: true
  }
})

defineEmits(['update:visible'])

const getOrganizationName = (id) => {
  const organization = props.organizations.find(org => org.id === id)
  return organization ? organization.name : ''
}

const getDepartmentName = (id) => {
  const department = props.departments.find(dep => dep.id === id)
  return department ? department.name : ''
}
</script> 