<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    header="Информация о пользователе"
    modal
    :style="{ width: '600px' }"
  >
    <div v-if="user" class="user-details">
      <div class="detail-item" v-if="user.id">
        <label>ID:</label>
        <span>{{ user.id }}</span>
      </div>
      
      <div class="detail-item" v-if="user.last_name">
        <label>Фамилия:</label>
        <span>{{ user.last_name }}</span>
      </div>
      
      <div class="detail-item" v-if="user.first_name">
        <label>Имя:</label>
        <span>{{ user.first_name }}</span>
      </div>
      
      <div class="detail-item" v-if="user.middle_name">
        <label>Отчество:</label>
        <span>{{ user.middle_name }}</span>
      </div>
      
      <div class="detail-item" v-if="user.login">
        <label>Логин:</label>
        <span>{{ user.login }}</span>
      </div>
      
      <div class="detail-item" v-if="user.role_name">
        <label>Роль:</label>
        <span>{{ user.role_name }}</span>
      </div>
      
      <div class="detail-item" v-if="user.created_at">
        <label>Создано:</label>
        <span>{{ new Date(user.created_at).toLocaleString() }}</span>
      </div>
      
      <div class="detail-item" v-if="user.updated_at">
        <label>Обновлено:</label>
        <span>{{ new Date(user.updated_at).toLocaleString() }}</span>
      </div>
    </div>

    <template #footer>
      <Button
        label="Закрыть"
        icon="pi pi-times"
        text
        @click="$emit('update:visible', false)"
      />
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object,
    required: true
  }
})

defineEmits(['update:visible'])
</script>
