<template>
  <div class="departments">
    <div class="header">
      <h1>Отделы</h1>
      <UIButton
        action="create"
        @click="openCreateDialog"
      />
    </div>

    <DepartmentsTable
      :departments="departments"
      :loading="loading"
      v-model:selectedDepartment="selectedDepartment"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @view="viewDetails"
      @edit="openEditDialog"
      @delete="confirmDelete"
      @sort="handleSort"
    />

    <DepartmentForm
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :loading="loading"
      :department="selectedDepartment"
      :organizations="organizations"
      :departments="departments"
      :errors="formErrors"
      @save="saveDepartment"
      @cancel="closeDialog"
    />

    <DepartmentDetails
      v-model:visible="detailsDialogVisible"
      :department="departmentDetails"
      :organizations="organizations"
      :departments="departments"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useDepartmentsStore } from '../../stores/departments'
import { useOrganizationsStore } from '../../stores/organizations'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import DepartmentsTable from '../../components/departments/DepartmentsTable.vue'
import DepartmentForm from '../../components/departments/DepartmentForm.vue'
import DepartmentDetails from '../../components/departments/DepartmentDetails.vue'
import { UIButton } from '../../components/UI/ui-components'

const store = useDepartmentsStore()
const organizationsStore = useOrganizationsStore()
const confirm = useConfirm()
const toast = useToast()

const dialogVisible = ref(false)
const dialogMode = ref('create')
const selectedDepartment = ref(null)
const formErrors = reactive({
  name: '',
  organization_id: '',
  parent_id: '',
  comment: ''
})

const sortField = ref('id')
const sortOrder = ref('ASC')

const handleSort = (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder === 1 ? 'ASC' : 'DESC'
  store.fetchDepartments({ sortField: sortField.value, sortOrder: sortOrder.value })
}

const departments = computed(() => store.departments)
const organizations = computed(() => organizationsStore.organizations)
const loading = computed(() => store.loading)
const detailsDialogVisible = ref(false)
const departmentDetails = computed(() => store.departmentDetails)

const openCreateDialog = () => {
  dialogMode.value = 'create'
  selectedDepartment.value = null
  clearErrors()
  dialogVisible.value = true
}

const openEditDialog = (department) => {
  dialogMode.value = 'edit'
  selectedDepartment.value = department
  clearErrors()

  const selectedOrg = organizations.value.find(org => org.id === department.organization_id)
  if (!selectedOrg) {
    formErrors.organization_id = 'Выбранная организация была удалена. Выберите другую организацию'
  }

  if (department.parent_id) {
    const parentDep = departments.value.find(dep => dep.id === department.parent_id)
    if (!parentDep) {
      formErrors.parent_id = 'Выбранный родительский отдел был удален. Выберите другой отдел'
    }
  }

  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  selectedDepartment.value = null
  clearErrors()
}

const clearErrors = () => {
  formErrors.name = ''
  formErrors.organization_id = ''
  formErrors.parent_id = ''
  formErrors.comment = ''
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
  if (error.response?.data) {
    const { message, errors } = error.response.data
    
    clearErrors()
    
    if (message) {
      if (message.includes('организаци')) {
        formErrors.organization_id = message
      } else if (message.includes('родительск')) {
        formErrors.parent_id = message
      }
    }
    
    if (errors) {
      errors.forEach(err => {
        if (err.includes('Название')) {
          formErrors.name = err
        } else if (err.includes('организации')) {
          formErrors.organization_id = err
        } else if (err.includes('Родительский отдел')) {
          formErrors.parent_id = err
        } else if (err.includes('Комментарий')) {
          formErrors.comment = err
        }
      })
    }
  }
}

const saveDepartment = async (formData) => {
  try {
    clearErrors()

    if (dialogMode.value === 'edit' && formData.organization_id) {
      const selectedOrg = organizations.value.find(org => org.id === formData.organization_id)
      if (!selectedOrg) {
        formErrors.organization_id = 'Выбранная организация была удалена. Выберите другую организацию'
        return
      }
    }
    
    if (dialogMode.value === 'create') {
      await store.createDepartment(formData)
      showSuccess('Отдел создан')
      closeDialog()
    } else {
      await store.updateDepartment(selectedDepartment.value.id, formData)
      showSuccess('Отдел обновлен')
      closeDialog()
    }
  } catch (error) {
    showError(error)
  }
}

const confirmDelete = (department) => {
  confirm.require({
    message: 'Вы действительно хотите удалить этот отдел?',
    header: 'Подтверждение удаления',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteDepartment(department.id),
    acceptLabel: 'Удалить',
    rejectLabel: 'Отмена'
  })
}

const deleteDepartment = async (id) => {
  try {
    await store.deleteDepartment(id)
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Отдел удален',
      life: 3000
    })
  } catch (error) {
    showError(error)
  }
}

const onRowSelect = (event) => {
  store.setSelectedDepartment(event.data)
}

const onRowUnselect = () => {
  store.setSelectedDepartment(null)
}

const viewDetails = async (department) => {
  try {
    await store.fetchDepartmentById(department.id)
    detailsDialogVisible.value = true
  } catch (error) {
    showError(error)
  }
}

onMounted(async () => {
  await Promise.all([
    store.fetchDepartments({ sortField: sortField.value, sortOrder: sortOrder.value }),
    organizationsStore.fetchOrganizations()
  ])
})
</script>