<template>
  <div class="employees">
    <div class="header">
      <h1>Сотрудники</h1>
      <div class="actions">
        <UIButton
          action="create"
          @click="openCreateDialog"
        />
        <UIButton
          action="upload"
          @click="openFileUploadDialog"
        />
      </div>
    </div>

    <EmployeesTable
      :employees="employees"
      :loading="loading"
      v-model:selectedEmployee="selectedEmployee"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @view="viewDetails"
      @edit="openEditDialog"
      @delete="confirmDelete"
      @sort="handleSort"
    />

    <EmployeeForm
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :loading="loading"
      :employee="selectedEmployee"
      :errors="formErrors"
      @save="saveEmployee"
      @cancel="closeDialog"
    />

    <EmployeeDetails
      v-model:visible="detailsDialogVisible"
      :employee="employeeDetails"
    />

    <FileForm
      v-model:visible="fileDialogVisible"
      mode="create"
      :loading="loading"
      :file="{ employee_id: selectedEmployee?.id }"
      :employees="selectedEmployee ? [{
        ...selectedEmployee,
        full_name: `${selectedEmployee.last_name} ${selectedEmployee.first_name}`
      }] : []"
      :errors="formErrors"
      @save="saveFile"
      @cancel="() => fileDialogVisible = false"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useEmployeesStore } from '../../stores/employees'
import { useFilesStore } from '../../stores/files'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import { UIButton } from '../../components/UI/ui-components'
import EmployeesTable from '../../components/employees/EmployeesTable.vue'
import EmployeeForm from '../../components/employees/EmployeeForm.vue'
import EmployeeDetails from '../../components/employees/EmployeeDetails.vue'
import FileForm from '../../components/files/FileForm.vue'

const store = useEmployeesStore()
const filesStore = useFilesStore()
const confirm = useConfirm()
const toast = useToast()

const dialogVisible = ref(false)
const fileDialogVisible = ref(false)
const dialogMode = ref('create')
const selectedEmployee = ref(null)
const formErrors = reactive({
  last_name: '',
  first_name: '',
  middle_name: '',
  date_of_birth: '',
  passport_series: '',
  passport_number: '',
  passport_issue_date: '',
  passport_department_code: '',
  passport_issued_by: '',
  registration_area: '',
  registration_city: '',
  registration_street: '',
  registration_house: '',
  registration_building: '',
  registration_apartment: ''
})

const sortField = ref('id')
const sortOrder = ref('ASC')

const employees = computed(() => store.employees)
const loading = computed(() => store.loading)
const detailsDialogVisible = ref(false)
const employeeDetails = computed(() => store.employeeDetails)

const handleSort = (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder === 1 ? 'ASC' : 'DESC'
  store.fetchEmployees({ sortField: sortField.value, sortOrder: sortOrder.value })
}

const openCreateDialog = () => {
  dialogMode.value = 'create'
  selectedEmployee.value = null
  clearErrors()
  dialogVisible.value = true
}

const openEditDialog = (employee) => {
  dialogMode.value = 'edit'
  selectedEmployee.value = employee
  clearErrors()
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  selectedEmployee.value = null
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
      } else if (errorMessage.includes('Дата рождения')) {
        formErrors.date_of_birth = errorMessage
      } else if (errorMessage.includes('Серия паспорта')) {
        formErrors.passport_series = errorMessage
      } else if (errorMessage.includes('Номер паспорта')) {
        formErrors.passport_number = errorMessage
      } else if (errorMessage.includes('Дата выдачи паспорта')) {
        formErrors.passport_issue_date = errorMessage
      } else if (errorMessage.includes('Код подразделения')) {
        formErrors.passport_department_code = errorMessage
      } else if (errorMessage.includes('Кем выдан паспорт')) {
        formErrors.passport_issued_by = errorMessage
      } else if (errorMessage.includes('Область/край/республика')) {
        formErrors.registration_area = errorMessage
      } else if (errorMessage.includes('Город')) {
        formErrors.registration_city = errorMessage
      } else if (errorMessage.includes('Улица')) {
        formErrors.registration_street = errorMessage
      } else if (errorMessage.includes('Номер дома')) {
        formErrors.registration_house = errorMessage
      } else if (errorMessage.includes('Корпус/строение')) {
        formErrors.registration_building = errorMessage
      } else if (errorMessage.includes('Номер квартиры')) {
        formErrors.registration_apartment = errorMessage
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

const saveEmployee = async (formData) => {
  try {
    clearErrors()
    if (dialogMode.value === 'create') {
      await store.createEmployee(formData)
      showSuccess('Сотрудник создан')
    } else {
      await store.updateEmployee(selectedEmployee.value.id, formData)
      await store.fetchEmployees()
      showSuccess('Сотрудник обновлен')
    }
    closeDialog()
  } catch (error) {
    handleError(error)
  }
}

const confirmDelete = (employee) => {
  confirm.require({
    message: 'Вы действительно хотите удалить этого сотрудника?',
    header: 'Подтверждение удаления',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteEmployee(employee.id),
    acceptLabel: 'Удалить',
    rejectLabel: 'Отмена'
  })
}

const deleteEmployee = async (id) => {
  try {
    await store.deleteEmployee(id)
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Сотрудник удален',
      life: 3000
    })
  } catch (error) {
    handleError(error)
  }
}

const onRowSelect = (event) => {
  store.setSelectedEmployee(event.data)
}

const onRowUnselect = () => {
  store.setSelectedEmployee(null)
}

const viewDetails = async (employee) => {
  try {
    await store.fetchEmployeeById(employee.id)
    detailsDialogVisible.value = true
  } catch (error) {
    handleError(error)
  }
}

const openFileUploadDialog = () => {
  if (!selectedEmployee.value) {
    toast.add({
      severity: 'warn',
      summary: 'Внимание',
      detail: 'Пожалуйста, выберите сотрудника для загрузки файла',
      life: 3000
    })
    return
  }
  fileDialogVisible.value = true
}

const saveFile = async (formData) => {
  try {
    Object.keys(formErrors).forEach(key => {
      formErrors[key] = ''
    })

    await filesStore.createFile(formData)
    fileDialogVisible.value = false
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Файл загружен',
      life: 3000
    })
  } catch (error) {
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach(errorMessage => {
        if (errorMessage.includes('Название файла')) {
          formErrors.name = errorMessage
        } else if (errorMessage.includes('ID сотрудника')) {
          formErrors.employee_id = errorMessage
        } else if (errorMessage.includes('Файл')) {
          formErrors.file_path = errorMessage
        }
      })
    } else {
      handleError(error)
    }
  }
}

onMounted(async () => {
  await store.fetchEmployees({ sortField: sortField.value, sortOrder: sortOrder.value })
})
</script>