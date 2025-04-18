<template>
  <div class="users">
    <div class="header">
      <h1>Пользователи</h1>
      <UIButton
        action="create"
        @click="openCreateDialog"
      />
    </div>

    <UsersTable
      :users="users"
      :loading="loading"
      v-model:selectedUser="selectedUser"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @view="viewDetails"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />

    <UserForm
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :loading="loading"
      :user="selectedUser"
      :errors="formErrors"
      @save="saveUser"
      @cancel="closeDialog"
    />

    <UserDetails
      v-model:visible="detailsDialogVisible"
      :user="userDetails"
      :loading="loading"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useUsersStore } from '../../stores/users'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import { UIButton } from '../../components/UI/ui-components'
import UsersTable from '../../components/users/UsersTable.vue'
import UserForm from '../../components/users/UserForm.vue'
import UserDetails from '../../components/users/UserDetails.vue'

const store = useUsersStore()
const confirm = useConfirm()
const toast = useToast()

const dialogVisible = ref(false)
const dialogMode = ref('create')
const selectedUser = ref(null)
const formErrors = reactive({
  last_name: '',
  first_name: '',
  middle_name: '',
  login: '',
  password: '',
  role_id: ''
})

const users = computed(() => store.users)
const loading = computed(() => store.loading)
const detailsDialogVisible = ref(false)
const userDetails = computed(() => store.userDetails)

const openCreateDialog = () => {
  dialogMode.value = 'create'
  selectedUser.value = null
  clearErrors()
  dialogVisible.value = true
}

const openEditDialog = (user) => {
  dialogMode.value = 'edit'
  selectedUser.value = user
  clearErrors()
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  selectedUser.value = null
  clearErrors()
}

const clearErrors = () => {
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
}

const showSuccess = (message) => {
  toast.add({
    severity: 'success',
    summary: 'Успешно',
    detail: message,
    life: 3000
  })
}

const showError = (error) => {
  if (error.response?.data?.errors) {
    error.response.data.errors.forEach(errorMessage => {
      if (errorMessage.includes('Фамилия')) {
        formErrors.last_name = errorMessage
      } else if (errorMessage.includes('Имя')) {
        formErrors.first_name = errorMessage
      } else if (errorMessage.includes('Отчество')) {
        formErrors.middle_name = errorMessage
      } else if (errorMessage.includes('Логин')) {
        formErrors.login = errorMessage
      } else if (errorMessage.includes('Пароль')) {
        formErrors.password = errorMessage
      } else if (errorMessage.includes('Роль')) {
        formErrors.role_id = errorMessage
      }
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.response?.data?.message || 'Произошла ошибка',
      life: 3000
    })
  }
}

const handleError = (error) => {
  showError(error)
}

const saveUser = async (formData) => {
  try {
    clearErrors()
    if (dialogMode.value === 'create') {
      await store.createUser(formData)
      await store.fetchUsers()
      showSuccess('Пользователь создан')
    } else {
      await store.updateUser(selectedUser.value.id, formData)
      await store.fetchUsers()
      showSuccess('Пользователь обновлен')
    }
    closeDialog()
  } catch (error) {
    handleError(error)
  }
}

const confirmDelete = (user) => {
  confirm.require({
    message: 'Вы действительно хотите удалить этого пользователя?',
    header: 'Подтверждение удаления',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteUser(user.id),
    acceptLabel: 'Удалить',
    rejectLabel: 'Отмена'
  })
}

const deleteUser = async (id) => {
  try {
    await store.deleteUser(id)
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Пользователь удален',
      life: 3000
    })
  } catch (error) {
    handleError(error)
  }
}

const onRowSelect = (event) => {
  store.setSelectedUser(event.data)
}

const onRowUnselect = () => {
  store.setSelectedUser(null)
}

const viewDetails = async (user) => {
  try {
    await store.fetchUserById(user.id)
    detailsDialogVisible.value = true
  } catch (error) {
    handleError(error)
  }
}

onMounted(async () => {
  await store.fetchUsers()
})
</script>
