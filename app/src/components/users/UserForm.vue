<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Создать пользователя' : 'Редактировать пользователя'"
    modal
    :style="{ width: '450px' }"
  >
    <UIInput
      id="last_name"
      v-model="formData.last_name"
      label="Фамилия"
      :error="errors.last_name"
      required
    />

    <UIInput
      id="first_name"
      v-model="formData.first_name"
      label="Имя"
      :error="errors.first_name"
      required
    />

    <UIInput
      id="middle_name"
      v-model="formData.middle_name"
      label="Отчество"
      :error="errors.middle_name"
    />

    <UIInput
      id="login"
      v-model="formData.login"
      label="Логин"
      :error="errors.login"
      required
    />

    <UIInput
      id="password"
      v-model="formData.password"
      :label="'Пароль' + (mode === 'edit' ? ' (оставьте пустым, если не хотите менять)' : '')"
      :error="errors.password"
      type="password"
      :required="mode === 'create'"
    />

    <UIDropdown
      id="role_id"
      v-model="formData.role_id"
      :options="[
        { id: 1, name: 'Администратор' },
        { id: 2, name: 'Менеджер по персоналу' }
      ]"
      optionLabel="name"
      optionValue="id"
      label="Роль"
      placeholder="Выберите роль"
      :error="errors.role_id"
      required
    />

    <template #footer>
      <UIButton
        action="cancel"
        @click="onCancel"
      />
      <UIButton
        action="save"
        :loading="loading"
        @click="onSave"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'
import { UIInput, UIDropdown, UIButton } from '../UI/ui-components'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  mode: {
    type: String,
    required: true,
    validator: (value) => ['create', 'edit'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: () => ({})
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'save', 'cancel'])

const formData = reactive({
  last_name: '',
  first_name: '',
  middle_name: '',
  login: '',
  password: '',
  role_id: null
})

watch(() => props.user, (newVal) => {
  if (newVal) {
    formData.last_name = newVal.last_name || ''
    formData.first_name = newVal.first_name || ''
    formData.middle_name = newVal.middle_name || ''
    formData.login = newVal.login || ''
    formData.password = ''
    formData.role_id = newVal.role_id
  }
}, { immediate: true })

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    formData.last_name = ''
    formData.first_name = ''
    formData.middle_name = ''
    formData.login = ''
    formData.password = ''
    formData.role_id = null
  }
})

const onSave = () => {
  const data = { ...formData }
  if (props.mode === 'edit' && !data.password) {
    delete data.password
  }
  emit('save', data)
}

const onCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}
</script>