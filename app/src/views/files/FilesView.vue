<template>
  <div class="files">
    <div class="header">
      <h1>Файлы</h1>
      <UIButton
        action="upload"
        @click="openCreateDialog"
      />
    </div>

    <FilesTable
      :files="files"
      :loading="loading"
      v-model:selectedFile="selectedFile"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @view="viewDetails"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />

    <FileForm
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :loading="loading"
      :file="selectedFile"
      :employees="employees"
      :errors="formErrors"
      @save="saveFile"
      @cancel="closeDialog"
    />

    <FileDetails
      v-model:visible="detailsDialogVisible"
      :file="fileDetails"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useFilesStore } from '../../stores/files'
import { useEmployeesStore } from '../../stores/employees'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import { UIButton } from '../../components/UI/ui-components'
import FilesTable from '../../components/files/FilesTable.vue'
import FileForm from '../../components/files/FileForm.vue'
import FileDetails from '../../components/files/FileDetails.vue'

const store = useFilesStore()
const employeesStore = useEmployeesStore()
const confirm = useConfirm()
const toast = useToast()

const dialogVisible = ref(false)
const dialogMode = ref('create')
const selectedFile = ref(null)
const formErrors = reactive({
  name: '',
  employee_id: '',
  file_path: ''
})

const files = computed(() => store.files)
const employees = computed(() => 
  employeesStore.employees.map(emp => ({
    ...emp,
    full_name: `${emp.last_name} ${emp.first_name}`
  }))
)
const loading = computed(() => store.loading)
const detailsDialogVisible = ref(false)
const fileDetails = computed(() => store.fileDetails)

const openCreateDialog = () => {
  dialogMode.value = 'create'
  selectedFile.value = null
  clearErrors()
  dialogVisible.value = true
}

const openEditDialog = (file) => {
  dialogMode.value = 'edit'
  selectedFile.value = file
  clearErrors()
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  selectedFile.value = null
  clearErrors()
}

const clearErrors = () => {
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
}

const showToast = (severity, summary, detail) => {
  toast.add({ severity, summary, detail, life: 3000 })
}

const handleError = (error) => {
  if (error.response?.data) {
    const { message, errors } = error.response.data
    
    clearErrors()
    
    if (Array.isArray(errors)) {
      errors.forEach(errorMessage => {
        if (errorMessage.includes('Название файла')) {
          formErrors.name = errorMessage
        } else if (errorMessage.includes('ID сотрудника')) {
          formErrors.employee_id = errorMessage
        }
      })
      return
    }
    
    if (message) {
      if (!message.includes('сотрудник') && !message.includes('файл') && !message.includes('Название')) {
        showToast('error', 'Ошибка', message)
      } else {
        if (message.includes('сотрудник')) {
          formErrors.employee_id = message
        } else if (message.includes('Название')) {
          formErrors.name = message
        }
      }
    }
  } else {
    showToast('error', 'Ошибка', 'Произошла ошибка при выполнении операции')
  }
}

const saveFile = async (formData) => {
  try {
    clearErrors()
    
    if (formData.errors) {
      Object.assign(formErrors, formData.errors)
      return
    }

    if (dialogMode.value === 'create') {
      await store.createFile(formData)
      showToast('success', 'Успешно', 'Файл загружен')
      closeDialog()
    } else {
      await store.updateFile(selectedFile.value.id, formData)
      showToast('success', 'Успешно', 'Файл обновлен')
      closeDialog()
    }
  } catch (error) {
    handleError(error)
  }
}

const confirmDelete = (file) => {
  confirm.require({
    message: 'Вы действительно хотите удалить этот файл?',
    header: 'Подтверждение удаления',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteFile(file.id),
    acceptLabel: 'Удалить',
    rejectLabel: 'Отмена'
  })
}

const deleteFile = async (id) => {
  try {
    await store.deleteFile(id)
    showToast('success', 'Успешно', 'Файл удален')
  } catch (error) {
    handleError(error)
  }
}

const onRowSelect = (event) => {
  store.setSelectedFile(event.data)
}

const onRowUnselect = () => {
  store.setSelectedFile(null)
}

const viewDetails = async (file) => {
  try {
    await store.fetchFileById(file.id)
    detailsDialogVisible.value = true
  } catch (error) {
    handleError(error)
  }
}

onMounted(async () => {
  await Promise.all([
    store.fetchFiles(),
    employeesStore.fetchEmployees()
  ])
})
</script> 