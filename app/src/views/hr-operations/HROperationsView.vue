<template>
  <div class="hr-operations">
    <div class="header">
      <h1>HR-операции</h1>
      <UIButton
        action="create"
        @click="openCreateDialog"
      />
    </div>

    <HrOperationsTable
      :hrOperations="hrOperations"
      :loading="loading"
      v-model:selectedHrOperation="selectedHrOperation"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @view="viewDetails"
      @edit="openEditDialog"
      @delete="confirmDelete"
      @sort="handleSort"
    />

    <HrOperationForm
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :loading="loading"
      :hrOperation="selectedHrOperation"
      :errors="formErrors"
      :employees="employees"
      :departments="departments"
      :positions="positions"
      @save="saveHrOperation"
      @cancel="closeDialog"
    />

    <HrOperationDetails
      v-model:visible="detailsDialogVisible"
      :hrOperation="hrOperationDetails"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useHrOperationsStore } from '../../stores/hr-operations'
import { useEmployeesStore } from '../../stores/employees'
import { useDepartmentsStore } from '../../stores/departments'
import { usePositionsStore } from '../../stores/positions'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import { UIButton } from '../../components/UI/ui-components'
import HrOperationsTable from '../../components/hr-operations/HrOperationsTable.vue'
import HrOperationForm from '../../components/hr-operations/HrOperationForm.vue'
import HrOperationDetails from '../../components/hr-operations/HrOperationDetails.vue'

const store = useHrOperationsStore()
const employeesStore = useEmployeesStore()
const departmentsStore = useDepartmentsStore()
const positionsStore = usePositionsStore()
const confirm = useConfirm()
const toast = useToast()

const dialogVisible = ref(false)
const dialogMode = ref('create')
const selectedHrOperation = ref(null)
const formErrors = reactive({
  employee_id: '',
  department_id: '',
  position_id: '',
  action: '',
  salary: ''
})

const hrOperations = computed(() => store.hrOperations)
const employees = computed(() => employeesStore.employees.map(emp => ({
  ...emp,
  full_name: `${emp.last_name} ${emp.first_name}`
})))
const departments = computed(() => departmentsStore.departments)
const positions = computed(() => positionsStore.positions)
const loading = computed(() => store.loading)
const detailsDialogVisible = ref(false)
const hrOperationDetails = computed(() => store.hrOperationDetails)

const sortField = ref('id')
const sortOrder = ref('ASC')

const openCreateDialog = () => {
  dialogMode.value = 'create'
  selectedHrOperation.value = null
  clearErrors()
  dialogVisible.value = true
}

const openEditDialog = (hrOperation) => {
  dialogMode.value = 'edit'
  selectedHrOperation.value = hrOperation
  clearErrors()
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  selectedHrOperation.value = null
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
      if (errorMessage.includes('ID сотрудника')) {
        formErrors.employee_id = errorMessage
      } else if (errorMessage.includes('ID отдела')) {
        formErrors.department_id = errorMessage
      } else if (errorMessage.includes('ID должности')) {
        formErrors.position_id = errorMessage
      } else if (errorMessage.includes('Действие')) {
        formErrors.action = errorMessage
      } else if (errorMessage.includes('Зарплата')) {
        formErrors.salary = errorMessage
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

const saveHrOperation = async (formData) => {
  try {
    clearErrors()
    if (dialogMode.value === 'create') {
      await store.createHrOperation(formData)
      showSuccess('HR-операция создана')
    } else {
      await store.updateHrOperation(selectedHrOperation.value.id, formData)
      showSuccess('HR-операция обновлена')
    }
    closeDialog()
  } catch (error) {
    handleError(error)
  }
}

const confirmDelete = (hrOperation) => {
  confirm.require({
    message: 'Вы действительно хотите удалить эту HR-операцию?',
    header: 'Подтверждение удаления',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteHrOperation(hrOperation.id),
    acceptLabel: 'Удалить',
    rejectLabel: 'Отмена'
  })
}

const deleteHrOperation = async (id) => {
  try {
    await store.deleteHrOperation(id)
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'HR-операция удалена',
      life: 3000
    })
  } catch (error) {
    handleError(error)
  }
}

const onRowSelect = (event) => {
  store.setSelectedHrOperation(event.data)
}

const onRowUnselect = () => {
  store.setSelectedHrOperation(null)
}

const viewDetails = async (hrOperation) => {
  try {
    await store.fetchHrOperationById(hrOperation.id)
    detailsDialogVisible.value = true
  } catch (error) {
    handleError(error)
  }
}

const handleSort = (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder === 1 ? 'ASC' : 'DESC'
  store.fetchHrOperations({ sortField: sortField.value, sortOrder: sortOrder.value })
}

onMounted(async () => {
  await Promise.all([
    store.fetchHrOperations({ sortField: sortField.value, sortOrder: sortOrder.value }),
    employeesStore.fetchEmployees(),
    departmentsStore.fetchDepartments(),
    positionsStore.fetchPositions()
  ])
})
</script> 