<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="mode === 'create' ? 'Создать пользователя' : 'Редактировать пользователя'"
    modal
    :style="{ width: '450px' }"
  >
    <div class="form-group">
      <label for="last_name">Фамилия*</label>
      <InputText
        id="last_name"
        v-model="formData.last_name"
        :class="{ 'p-invalid': errors.last_name }"
      />
      <small class="p-error">{{ errors.last_name }}</small>
    </div>

    <div class="form-group">
      <label for="first_name">Имя*</label>
      <InputText
        id="first_name"
        v-model="formData.first_name"
        :class="{ 'p-invalid': errors.first_name }"
      />
      <small class="p-error">{{ errors.first_name }}</small>
    </div>

    <div class="form-group">
      <label for="middle_name">Отчество</label>
      <InputText
        id="middle_name"
        v-model="formData.middle_name"
        :class="{ 'p-invalid': errors.middle_name }"
      />
      <small class="p-error">{{ errors.middle_name }}</small>
    </div>

    <div class="form-group">
      <label for="login">Логин*</label>
      <InputText
        id="login"
        v-model="formData.login"
        :class="{ 'p-invalid': errors.login }"
      />
      <small class="p-error">{{ errors.login }}</small>
    </div>

    <div class="form-group">
      <label for="password">Пароль{{ mode === 'edit' ? ' (оставьте пустым, если не хотите менять)' : '*' }}</label>
      <Password
        id="password"
        v-model="formData.password"
        :feedback="false"
        :toggleMask="true"
        :class="{ 'p-invalid': errors.password }"
      />
      <small class="p-error">{{ errors.password }}</small>
    </div>

    <div class="form-group">
      <label for="role_id">Роль*</label>
      <div class="p-inputgroup">
        <Dropdown
          id="role_id"
          v-model="formData.role_id"
          :options="[
            { id: 1, name: 'Администратор' },
            { id: 2, name: 'Менеджер по персоналу' }
          ]"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите роль"
          :class="{ 'p-invalid': errors.role_id }"
        />
        <Button
          icon="pi pi-times"
          @click="formData.role_id = null"
          :disabled="!formData.role_id"
        />
      </div>
      <small class="p-error">{{ errors.role_id }}</small>
    </div>

    <template #footer>
      <Button label="Отмена" icon="pi pi-times" text @click="onCancel" />
      <Button
        label="Сохранить"
        icon="pi pi-check"
        @click="onSave"
        :loading="loading"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

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