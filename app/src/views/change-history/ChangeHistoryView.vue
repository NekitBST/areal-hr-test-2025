<template>
  <div class="change-history">
    <div class="header">
      <h1>История изменений</h1>
    </div>

    <ChangeHistoryTable
      :changeHistory="changeHistory"
      :loading="loading"
      v-model:selectedChangeHistory="selectedChangeHistory"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @view="viewDetails"
      @sort="handleSort"
    />

    <ChangeHistoryDetails
      v-model:visible="detailsDialogVisible"
      :changeHistory="changeHistoryDetails"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useChangeHistoryStore } from '../../stores/change-history'
import { useToast } from 'primevue/usetoast'
import ChangeHistoryTable from '../../components/change-history/ChangeHistoryTable.vue'
import ChangeHistoryDetails from '../../components/change-history/ChangeHistoryDetails.vue'

const store = useChangeHistoryStore()
const toast = useToast()

const selectedChangeHistory = ref(null)
const detailsDialogVisible = ref(false)
const sortField = ref('id')
const sortOrder = ref('ASC')

const changeHistory = computed(() => store.changeHistory)
const loading = computed(() => store.loading)
const changeHistoryDetails = computed(() => store.changeHistoryDetails)

const showError = (error) => {
  toast.add({
    severity: 'error',
    summary: 'Ошибка',
    detail: error.response?.data?.message || 'Произошла ошибка',
    life: 3000
  })
}

const onRowSelect = (event) => {
  store.setSelectedChangeHistory(event.data)
}

const onRowUnselect = () => {
  store.setSelectedChangeHistory(null)
}

const handleSort = (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder === 1 ? 'ASC' : 'DESC'
  store.fetchChangeHistory({ sortField: sortField.value, sortOrder: sortOrder.value })
}

const viewDetails = async (changeHistory) => {
  try {
    await store.fetchChangeHistoryById(changeHistory.id)
    detailsDialogVisible.value = true
  } catch (error) {
    showError(error)
  }
}

onMounted(async () => {
  try {
    await store.fetchChangeHistory({ sortField: sortField.value, sortOrder: sortOrder.value })
  } catch (error) {
    showError(error)
  }
})
</script> 