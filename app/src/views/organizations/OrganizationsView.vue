<template>
  <div class="organizations">
    <div class="header">
      <h1>Организации</h1>
      <Button label="Создать" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <DataTable
      :value="organizations"
      :loading="loading"
      :paginator="true"
      :rows="10"
      stripedRows
      v-model:selection="selectedOrganization"
      selectionMode="single"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      :rowClass="getRowClass"
    >
      <Column field="id" header="ID" sortable />
      <Column field="name" header="Название" sortable>
        <template #body="{ data }">
          <span>{{ data.name.length > 15 ? data.name.slice(0, 15) + '...' : data.name }}</span>
        </template>
      </Column>
      <Column field="comment" header="Комментарий">
        <template #body="{ data }">
          <span>{{ data.comment.length > 15 ? data.comment.slice(0, 15) + '...' : data.comment }}</span>
        </template>
      </Column>
      <Column field="created_at" header="Создано" sortable>
        <template #body="{ data }">
          {{ new Date(data.created_at).toLocaleString() }}
        </template>
      </Column>
      <Column field="updated_at" header="Обновлено" sortable>
        <template #body="{ data }">
          {{ new Date(data.updated_at).toLocaleString() }}
        </template>
      </Column>
      <Column field="deleted_at" header="Удалено" sortable>
        <template #body="{ data }">
          {{ data.deleted_at ? new Date(data.deleted_at).toLocaleString() : '' }}
        </template>
      </Column>
      <Column header="Действия">
        <template #body="{ data }">
          <div class="actions">
            <Button
              icon="pi pi-eye"
              text
              rounded
              severity="info"
              @click="viewDetails(data)"
            />
            <template v-if="!data.deleted_at">
              <Button
                icon="pi pi-pencil"
                text
                rounded
                severity="info"
                @click="openEditDialog(data)"
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                @click="confirmDelete(data)"
              />
            </template>
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="dialogVisible"
      :header="dialogMode === 'create' ? 'Создать организацию' : 'Редактировать организацию'"
      modal
      :style="{ width: '450px' }"
    >
      <div class="form-group">
        <label for="name">Название*</label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': formErrors.name }"
        />
        <small class="p-error">{{ formErrors.name }}</small>
      </div>

      <div class="form-group">
        <label for="comment">Комментарий</label>
        <Textarea
          id="comment"
          v-model="formData.comment"
          rows="3"
          :class="{ 'p-invalid': formErrors.comment }"
        />
        <small class="p-error">{{ formErrors.comment }}</small>
      </div>

      <template #footer>
        <Button label="Отмена" icon="pi pi-times" text @click="closeDialog" />
        <Button
          label="Сохранить"
          icon="pi pi-check"
          @click="saveOrganization"
          :loading="loading"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="detailsDialogVisible"
      header="Детальная информация об организации"
      modal
      :style="{ width: '600px' }"
    >
      <div v-if="organizationDetails" class="organization-details">
        <div class="detail-item">
          <label>ID:</label>
          <span>{{ organizationDetails.id }}</span>
        </div>
        <div class="detail-item">
          <label>Название:</label>
          <span>{{ organizationDetails.name }}</span>
        </div>
        <div class="detail-item" v-if="organizationDetails.comment">
          <label>Комментарий:</label>
          <span>{{ organizationDetails.comment }}</span>
        </div>
        <div class="detail-item">
          <label>Создано:</label>
          <span>{{ new Date(organizationDetails.created_at).toLocaleString() }}</span>
        </div>
        <div class="detail-item">
          <label>Обновлено:</label>
          <span>{{ new Date(organizationDetails.updated_at).toLocaleString() }}</span>
        </div>
        <div class="detail-item" v-if="organizationDetails.deleted_at">
          <label>Удалено:</label>
          <span>{{ new Date(organizationDetails.deleted_at).toLocaleString() }}</span>
        </div>
      </div>
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useOrganizationsStore } from '../../stores/organizations'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import ConfirmDialog from 'primevue/confirmdialog'

const store = useOrganizationsStore()
const confirm = useConfirm()
const toast = useToast()

const dialogVisible = ref(false)
const dialogMode = ref('create')
const selectedOrganization = ref(null)
const formData = reactive({
  name: '',
  comment: ''
})
const formErrors = reactive({
  name: '',
  comment: ''
})

const organizations = computed(() => store.organizations)
const loading = computed(() => store.loading)
const detailsDialogVisible = ref(false)
const organizationDetails = computed(() => store.organizationDetails)

const openCreateDialog = () => {
  dialogMode.value = 'create'
  formData.name = ''
  formData.comment = ''
  clearErrors()
  dialogVisible.value = true
}

const openEditDialog = (organization) => {
  dialogMode.value = 'edit'
  selectedOrganization.value = organization
  formData.name = organization.name
  formData.comment = organization.comment || ''
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

const saveOrganization = async () => {
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

const getRowClass = (data) => {
  return {
    'deleted-row': data.deleted_at
  }
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
  await store.fetchOrganizations()
})
</script>