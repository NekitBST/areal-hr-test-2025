<template>
  <div class="departments">
    <div class="header">
      <h1>Отделы</h1>
      <Button label="Создать" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <DataTable
      :value="departments"
      :loading="loading"
      :paginator="true"
      :rows="10"
      stripedRows
      v-model:selection="selectedDepartment"
      selectionMode="single"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
    >
      <Column field="id" header="ID" sortable />
      <Column field="name" header="Название" sortable>
        <template #body="{ data }">
          <span>{{ data.name.length > 15 ? data.name.slice(0, 15) + '...' : data.name }}</span>
        </template>
      </Column>
      <Column field="comment" header="Комментарий">
        <template #body="{ data }">
          <span>{{ data.comment?.length > 15 ? data.comment.slice(0, 15) + '...' : data.comment }}</span>
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
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="dialogVisible"
      :header="dialogMode === 'create' ? 'Создать отдел' : 'Редактировать отдел'"
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
        <label for="organization">Организация*</label>
        <div class="p-inputgroup">
          <Dropdown
            id="organization"
            v-model="formData.organization_id"
            :options="activeOrganizations"
            optionLabel="name"
            optionValue="id"
            placeholder="Выберите организацию"
            :class="{ 'p-invalid': formErrors.organization_id }"
          />
          <Button
            icon="pi pi-times"
            @click="formData.organization_id = null"
            :disabled="!formData.organization_id"
          />
        </div>
        <small class="p-error">{{ formErrors.organization_id }}</small>
      </div>

      <div class="form-group">
        <label for="parent">Родительский отдел</label>
        <div class="p-inputgroup">
          <Dropdown
            id="parent"
            v-model="formData.parent_id"
            :options="activeDepartments"
            optionLabel="name"
            optionValue="id"
            placeholder="Выберите родительский отдел"
            :class="{ 'p-invalid': formErrors.parent_id }"
          />
          <Button
            icon="pi pi-times"
            @click="formData.parent_id = null"
            :disabled="!formData.parent_id"
          />
        </div>
        <small class="p-error">{{ formErrors.parent_id }}</small>
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
          @click="saveDepartment"
          :loading="loading"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="detailsDialogVisible"
      header="Детальная информация об отделе"
      modal
      :style="{ width: '600px' }"
    >
      <div v-if="departmentDetails" class="department-details">
        <div class="detail-item">
          <label>ID:</label>
          <span>{{ departmentDetails.id }}</span>
        </div>
        <div class="detail-item">
          <label>Название:</label>
          <span>{{ departmentDetails.name }}</span>
        </div>
        <div class="detail-item">
          <label>Организация:</label>
          <span>{{ getOrganizationName(departmentDetails.organization_id) }}</span>
        </div>
        <div class="detail-item" v-if="departmentDetails.parent_id">
          <label>Родительский отдел:</label>
          <span>{{ getDepartmentName(departmentDetails.parent_id) }}</span>
        </div>
        <div class="detail-item" v-if="departmentDetails.comment">
          <label>Комментарий:</label>
          <span>{{ departmentDetails.comment }}</span>
        </div>
        <div class="detail-item">
          <label>Создано:</label>
          <span>{{ new Date(departmentDetails.created_at).toLocaleString() }}</span>
        </div>
        <div class="detail-item">
          <label>Обновлено:</label>
          <span>{{ new Date(departmentDetails.updated_at).toLocaleString() }}</span>
        </div>
      </div>
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useDepartmentsStore } from '../../stores/departments'
import { useOrganizationsStore } from '../../stores/organizations'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import ConfirmDialog from 'primevue/confirmdialog'

const store = useDepartmentsStore()
const organizationsStore = useOrganizationsStore()
const confirm = useConfirm()
const toast = useToast()

const dialogVisible = ref(false)
const dialogMode = ref('create')
const selectedDepartment = ref(null)
const formData = reactive({
  name: '',
  organization_id: null,
  parent_id: null,
  comment: ''
})
const formErrors = reactive({
  name: '',
  organization_id: '',
  parent_id: '',
  comment: ''
})

const departments = computed(() => store.departments)
const organizations = computed(() => organizationsStore.organizations)
const loading = computed(() => store.loading)
const detailsDialogVisible = ref(false)
const departmentDetails = computed(() => store.departmentDetails)

const activeOrganizations = computed(() => organizations.value)
const activeDepartments = computed(() => departments.value.filter(dep => dep.id !== selectedDepartment.value?.id))

const openCreateDialog = () => {
  dialogMode.value = 'create'
  formData.name = ''
  formData.organization_id = null
  formData.parent_id = null
  formData.comment = ''
  clearErrors()
  dialogVisible.value = true
}

const openEditDialog = (department) => {
  dialogMode.value = 'edit'
  selectedDepartment.value = department
  formData.name = department.name
  formData.organization_id = department.organization_id
  formData.parent_id = department.parent_id
  formData.comment = department.comment || ''
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

const saveDepartment = async () => {
  try {
    clearErrors()

    if (dialogMode.value === 'edit' && formData.organization_id) {
      const selectedOrg = organizations.value.find(org => org.id === formData.organization_id)
      if (!selectedOrg) {
        formErrors.organization_id = 'Выбранная организация была удалена. Выберите другую организацию'
        return
      }
    }
    
    const data = {
      ...formData,
      organization_id: formData.organization_id || null,
      parent_id: formData.parent_id || null
    }
    
    if (dialogMode.value === 'create') {
      await store.createDepartment(data)
      showSuccess('Отдел создан')
      closeDialog()
    } else {
      await store.updateDepartment(selectedDepartment.value.id, data)
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

const getOrganizationName = (id) => {
  const organization = organizations.value.find(org => org.id === id)
  return organization ? organization.name : ''
}

const getDepartmentName = (id) => {
  const department = departments.value.find(dep => dep.id === id)
  return department ? department.name : ''
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
    store.fetchDepartments(),
    organizationsStore.fetchOrganizations()
  ])
})
</script>