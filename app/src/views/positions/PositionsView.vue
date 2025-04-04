<template>
  <div class="positions">
    <div class="header">
      <h1>Должности</h1>
      <Button label="Создать" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <DataTable
      :value="positions"
      :loading="loading"
      :paginator="true"
      :rows="10"
      stripedRows
      v-model:selection="selectedPosition"
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
      :header="dialogMode === 'create' ? 'Создать должность' : 'Редактировать должность'"
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

      <template #footer>
        <Button label="Отмена" icon="pi pi-times" text @click="closeDialog" />
        <Button
          label="Сохранить"
          icon="pi pi-check"
          @click="savePosition"
          :loading="loading"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="detailsDialogVisible"
      header="Детальная информация о должности"
      modal
      :style="{ width: '600px' }"
    >
      <div v-if="positionDetails" class="position-details">
        <div class="detail-item">
          <label>ID:</label>
          <span>{{ positionDetails.id }}</span>
        </div>
        <div class="detail-item">
          <label>Название:</label>
          <span>{{ positionDetails.name }}</span>
        </div>
        <div class="detail-item">
          <label>Создано:</label>
          <span>{{ new Date(positionDetails.created_at).toLocaleString() }}</span>
        </div>
        <div class="detail-item">
          <label>Обновлено:</label>
          <span>{{ new Date(positionDetails.updated_at).toLocaleString() }}</span>
        </div>
        <div class="detail-item" v-if="positionDetails.deleted_at">
          <label>Удалено:</label>
          <span>{{ new Date(positionDetails.deleted_at).toLocaleString() }}</span>
        </div>
      </div>
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { usePositionsStore } from '../../stores/positions'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import ConfirmDialog from 'primevue/confirmdialog'

const store = usePositionsStore()
const confirm = useConfirm()
const toast = useToast()

const dialogVisible = ref(false)
const dialogMode = ref('create')
const selectedPosition = ref(null)
const formData = reactive({
  name: ''
})
const formErrors = reactive({
  name: ''
})

const positions = computed(() => store.positions)
const loading = computed(() => store.loading)
const detailsDialogVisible = ref(false)
const positionDetails = computed(() => store.positionDetails)

const openCreateDialog = () => {
  dialogMode.value = 'create'
  formData.name = ''
  clearErrors()
  dialogVisible.value = true
}

const openEditDialog = (position) => {
  dialogMode.value = 'edit'
  selectedPosition.value = position
  formData.name = position.name
  clearErrors()
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  selectedPosition.value = null
  clearErrors()
}

const clearErrors = () => {
  formErrors.name = ''
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

const savePosition = async () => {
  try {
    clearErrors()
    if (dialogMode.value === 'create') {
      await store.createPosition(formData)
      showSuccess('Должность создана')
    } else {
      await store.updatePosition(selectedPosition.value.id, formData)
      showSuccess('Должность обновлена')
    }
    closeDialog()
  } catch (error) {
    handleError(error)
  }
}

const confirmDelete = (position) => {
  confirm.require({
    message: 'Вы действительно хотите удалить эту должность?',
    header: 'Подтверждение удаления',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deletePosition(position.id),
    acceptLabel: 'Удалить',
    rejectLabel: 'Отмена'
  })
}

const deletePosition = async (id) => {
  try {
    await store.deletePosition(id)
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Должность удалена',
      life: 3000
    })
  } catch (error) {
    handleError(error)
  }
}

const onRowSelect = (event) => {
  store.setSelectedPosition(event.data)
}

const onRowUnselect = () => {
  store.setSelectedPosition(null)
}

const getRowClass = (data) => {
  return {
    'deleted-row': data.deleted_at
  }
}

const viewDetails = async (position) => {
  try {
    await store.fetchPositionById(position.id)
    detailsDialogVisible.value = true
  } catch (error) {
    handleError(error)
  }
}

onMounted(async () => {
  await store.fetchPositions()
})
</script> 