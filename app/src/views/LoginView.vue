<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const authStore = useAuthStore()
const toast = useToast()

const credentials = ref({
  login: '',
  password: ''
})

const loading = ref(false)

const handleSubmit = async () => {
  if (!credentials.value.login || !credentials.value.password) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Заполните все поля',
      life: 3000
    })
    return
  }

  loading.value = true
  const success = await authStore.login(credentials.value)
  loading.value = false

  if (!success) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Неверный логин или пароль',
      life: 3000
    })
  }
}
</script>

<template>
  <div class="login-page">
    <Card>
      <template #title>
        <h2>Вход в систему</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-field">
            <label for="login">Логин</label>
            <InputText
              id="login"
              v-model="credentials.login"
              :disabled="loading"
              placeholder="Введите логин"
              autocomplete="username"
            />
          </div>
          <div class="form-field">
            <label for="password">Пароль</label>
            <Password
              id="password"
              v-model="credentials.password"
              :feedback="false"
              toggleMask
              :disabled="loading"
              placeholder="Введите пароль"
              autocomplete="current-password"
            />
          </div>
          <Button
            type="submit"
            label="Войти"
            :loading="loading"
          />
        </form>
      </template>
    </Card>
  </div>
</template>
