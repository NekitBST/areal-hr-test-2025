<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    header="Детальная информация об организации"
    modal
    :style="{ width: '600px' }"
  >
    <div v-if="organization" class="organization-details">
      <div class="detail-item">
        <label>ID:</label>
        <span>{{ organization.id }}</span>
      </div>
      <div class="detail-item">
        <label>Название:</label>
        <span>{{ organization.name }}</span>
      </div>
      <div class="detail-item" v-if="organization.comment">
        <label>Комментарий:</label>
        <span>{{ organization.comment }}</span>
      </div>
      <div class="detail-item">
        <label>Создано:</label>
        <span>{{ new Date(organization.created_at).toLocaleString() }}</span>
      </div>
      <div class="detail-item">
        <label>Обновлено:</label>
        <span>{{ new Date(organization.updated_at).toLocaleString() }}</span>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'

defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  organization: {
    type: Object,
    required: true
  }
})

defineEmits(['update:visible'])
</script> 