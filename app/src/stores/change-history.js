import { defineStore } from 'pinia'
import { changeHistoryApi } from '../services/api'

export const useChangeHistoryStore = defineStore('changeHistory', {
  state: () => ({
    changeHistory: [],
    selectedChangeHistory: null,
    loading: false,
    changeHistoryDetails: null
  }),

  actions: {
    async fetchChangeHistory(params = {}) {
      this.loading = true
      try {
        const response = await changeHistoryApi.getAll(params)
        this.changeHistory = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchChangeHistoryById(id) {
      this.loading = true
      try {
        const response = await changeHistoryApi.getById(id)
        this.changeHistoryDetails = response.data
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedChangeHistory(changeHistory) {
      this.selectedChangeHistory = changeHistory
    }
  }
}) 