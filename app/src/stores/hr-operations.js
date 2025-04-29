import { defineStore } from 'pinia'
import { hrOperationsApi } from '../services/api'

export const useHrOperationsStore = defineStore('hrOperations', {
  state: () => ({
    hrOperations: [],
    selectedHrOperation: null,
    loading: false,
    hrOperationDetails: null
  }),

  getters: {
    getLastEmployeeOperation: (state) => (employeeId) => {
      const employeeOperations = state.hrOperations
        .filter(op => op.employee_id === employeeId)
        .sort((a, b) => new Date(b.action_date) - new Date(a.action_date));
      return employeeOperations[0] || null;
    }
  },

  actions: {
    async fetchHrOperations() {
      this.loading = true
      try {
        const response = await hrOperationsApi.getAll()
        this.hrOperations = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchHrOperationById(id) {
      this.loading = true
      try {
        const response = await hrOperationsApi.getById(id)
        this.hrOperationDetails = response.data
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createHrOperation(data) {
      this.loading = true
      try {
        const response = await hrOperationsApi.create(data)
        this.hrOperations.push(response.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateHrOperation(id, data) {
      this.loading = true
      try {
        const response = await hrOperationsApi.update(id, data)
        const index = this.hrOperations.findIndex(op => op.id === id)
        if (index !== -1) {
          this.hrOperations[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteHrOperation(id) {
      this.loading = true
      try {
        await hrOperationsApi.delete(id)
        const index = this.hrOperations.findIndex(op => op.id === id)
        if (index !== -1) {
          this.hrOperations.splice(index, 1)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedHrOperation(hrOperation) {
      this.selectedHrOperation = hrOperation
    }
  }
}) 