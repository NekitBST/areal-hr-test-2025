<template>
  <div class="positions">
    <div class="header">
      <h1>Должности</h1>
      <UIButton
        action="create"
        @click="openCreateDialog"
      />
    </div>

    <PositionsTable
      :positions="positions"
      :loading="loading"
      v-model:selectedPosition="selectedPosition"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @view="viewDetails"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />

    <PositionForm
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :loading="loading"
      :position="selectedPosition"
      :errors="formErrors"
      @save="savePosition"
      @cancel="closeDialog"
    />

    <PositionDetails
      v-model:visible="detailsDialogVisible"
      :position="positionDetails"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { usePositionsStore } from '../../stores/positions'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import PositionsTable from '../../components/positions/PositionsTable.vue'
import PositionForm from '../../components/positions/PositionForm.vue'
import PositionDetails from '../../components/positions/PositionDetails.vue'
import { UIButton } from '../../components/UI/ui-components'

const store = usePositionsStore()
const confirm = useConfirm()
const toast = useToast()

const dialogVisible = ref(false)
const dialogMode = ref('create')
const selectedPosition = ref(null)
const formErrors = reactive({
  name: ''
})

const positions = computed(() => store.positions)
const loading = computed(() => store.loading)
const detailsDialogVisible = ref(false)
const positionDetails = computed(() => store.positionDetails)

const openCreateDialog = () => {
  dialogMode.value = 'create'
  selectedPosition.value = null
  clearErrors()
  dialogVisible.value = true
}

const openEditDialog = (position) => {
  dialogMode.value = 'edit'
  selectedPosition.value = position
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

const savePosition = async (formData) => {
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