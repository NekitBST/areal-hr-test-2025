<template>
  <div class="organizations">
    <div class="header">
      <h1>Организации</h1>
      <UIButton
        action="create"
        @click="openCreateDialog"
      />
    </div>

    <OrganizationsTable
      :organizations="organizations"
      :loading="loading"
      v-model:selectedOrganization="selectedOrganization"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @view="viewDetails"
      @edit="openEditDialog"
      @delete="confirmDelete"
      @sort="handleSort"
    />

    <OrganizationForm
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :loading="loading"
      :organization="selectedOrganization"
      :errors="formErrors"
      @save="saveOrganization"
      @cancel="closeDialog"
    />

    <OrganizationDetails
      v-model:visible="detailsDialogVisible"
      :organization="organizationDetails"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useOrganizationsStore } from '../../stores/organizations'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import OrganizationsTable from '../../components/organizations/OrganizationsTable.vue'
import OrganizationForm from '../../components/organizations/OrganizationForm.vue'
import OrganizationDetails from '../../components/organizations/OrganizationDetails.vue'
import { UIButton } from '../../components/UI/ui-components'

const store = useOrganizationsStore()
const confirm = useConfirm()
const toast = useToast()

const dialogVisible = ref(false)
const dialogMode = ref('create')
const selectedOrganization = ref(null)
const formErrors = reactive({
  name: '',
  comment: ''
})

const sortField = ref('id')
const sortOrder = ref('ASC')

const handleSort = (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder === 1 ? 'ASC' : 'DESC'
  store.fetchOrganizations({ sortField: sortField.value, sortOrder: sortOrder.value })
}

const organizations = computed(() => store.organizations)
const loading = computed(() => store.loading)
const detailsDialogVisible = ref(false)
const organizationDetails = computed(() => store.organizationDetails)

const openCreateDialog = () => {
  dialogMode.value = 'create'
  selectedOrganization.value = null
  clearErrors()
  dialogVisible.value = true
}

const openEditDialog = (organization) => {
  dialogMode.value = 'edit'
  selectedOrganization.value = organization
  clearErrors()
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  selectedOrganization.value = null
  clearErrors()
}

const clearErrors = () => {
  formErrors.name = ''
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
  if (error.response?.data?.errors) {
    error.response.data.errors.forEach(errorMessage => {
      if (errorMessage.includes('Название')) {
        formErrors.name = errorMessage
      } else if (errorMessage.includes('Комментарий')) {
        formErrors.comment = errorMessage
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

const saveOrganization = async (formData) => {
  try {
    clearErrors()
    if (dialogMode.value === 'create') {
      await store.createOrganization(formData)
      showSuccess('Организация создана')
    } else {
      await store.updateOrganization(selectedOrganization.value.id, formData)
      showSuccess('Организация обновлена')
    }
    closeDialog()
  } catch (error) {
    handleError(error)
  }
}

const confirmDelete = (organization) => {
  confirm.require({
    message: 'Вы действительно хотите удалить эту организацию?',
    header: 'Подтверждение удаления',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteOrganization(organization.id),
    acceptLabel: 'Удалить',
    rejectLabel: 'Отмена'
  })
}

const deleteOrganization = async (id) => {
  try {
    await store.deleteOrganization(id)
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Организация удалена',
      life: 3000
    })
  } catch (error) {
    handleError(error)
  }
}

const onRowSelect = (event) => {
  store.setSelectedOrganization(event.data)
}

const onRowUnselect = () => {
  store.setSelectedOrganization(null)
}

const viewDetails = async (organization) => {
  try {
    await store.fetchOrganizationById(organization.id)
    detailsDialogVisible.value = true
  } catch (error) {
    handleError(error)
  }
}

onMounted(async () => {
  await store.fetchOrganizations({ sortField: sortField.value, sortOrder: sortOrder.value })
})
</script>