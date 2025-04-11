<template>
  <div class="employees">
    <div class="header">
      <h1>Сотрудники</h1>
      <Button label="Создать" icon="pi pi-plus" @click="openCreateDialog" />
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

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useEmployeesStore } from '../../stores/employees'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import EmployeesTable from '../../components/employees/EmployeesTable.vue'
import EmployeeForm from '../../components/employees/EmployeeForm.vue'
import EmployeeDetails from '../../components/employees/EmployeeDetails.vue'

const store = useEmployeesStore()
const confirm = useConfirm()
const toast = useToast()

const dialogVisible = ref(false)
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

const employees = computed(() => store.employees)
const loading = computed(() => store.loading)
const detailsDialogVisible = ref(false)
const employeeDetails = computed(() => store.employeeDetails)

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
  formErrors.last_name = ''
  formErrors.first_name = ''
  formErrors.middle_name = ''
  formErrors.date_of_birth = ''
  formErrors.passport_series = ''
  formErrors.passport_number = ''
  formErrors.passport_issue_date = ''
  formErrors.passport_department_code = ''
  formErrors.passport_issued_by = ''
  formErrors.registration_area = ''
  formErrors.registration_city = ''
  formErrors.registration_street = ''
  formErrors.registration_house = ''
  formErrors.registration_building = ''
  formErrors.registration_apartment = ''
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

onMounted(async () => {
  await store.fetchEmployees()
})
</script> 