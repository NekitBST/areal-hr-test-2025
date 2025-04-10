<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    header="Детальная информация о должности"
    modal
    :style="{ width: '600px' }"
  >
    <div v-if="position" class="position-details">
      <div class="detail-item">
        <label>ID:</label>
        <span>{{ position.id }}</span>
      </div>
      <div class="detail-item">
        <label>Название:</label>
        <span>{{ position.name }}</span>
      </div>
      <div class="detail-item">
        <label>Создано:</label>
        <span>{{ new Date(position.created_at).toLocaleString() }}</span>
      </div>
      <div class="detail-item">
        <label>Обновлено:</label>
        <span>{{ new Date(position.updated_at).toLocaleString() }}</span>
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
  position: {
    type: Object,
    required: true
  }
})

defineEmits(['update:visible'])
</script> 