import { defineStore } from 'pinia'
import { employeesApi } from '../services/api'
import { useHrOperationsStore } from './hr-operations'

export const useEmployeesStore = defineStore('employees', {
  state: () => ({
    employees: [],
    selectedEmployee: null,
    loading: false,
    employeeDetails: null
  }),

  getters: {
    isEmployeeDismissed: (state) => (employeeId) => {
      const hrOperationsStore = useHrOperationsStore()
      const lastOperation = hrOperationsStore.getLastEmployeeOperation(employeeId)
      return lastOperation?.action === 'Увольнение'
    }
  },

  actions: {
    async fetchEmployees() {
      this.loading = true
      try {
        const response = await employeesApi.getAll()
        this.employees = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchEmployeeById(id) {
      this.loading = true
      try {
        const response = await employeesApi.getById(id)
        this.employeeDetails = response.data
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createEmployee(data) {
      this.loading = true
      try {
        const response = await employeesApi.create(data)
        this.employees.push(response.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateEmployee(id, data) {
      this.loading = true
      try {
        const response = await employeesApi.update(id, data)
        const index = this.employees.findIndex(emp => emp.id === id)
        if (index !== -1) {
          this.employees[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteEmployee(id) {
      this.loading = true
      try {
        await employeesApi.delete(id)
        const index = this.employees.findIndex(emp => emp.id === id)
        if (index !== -1) {
          this.employees.splice(index, 1)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedEmployee(employee) {
      this.selectedEmployee = employee
    }
  }
}) 