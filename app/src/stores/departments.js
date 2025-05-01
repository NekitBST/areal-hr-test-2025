import { defineStore } from 'pinia'
import { departmentsApi } from '../services/api'

export const useDepartmentsStore = defineStore('departments', {
  state: () => ({
    departments: [],
    departmentDetails: null,
    selectedDepartment: null,
    loading: false
  }),

  actions: {
    setSelectedDepartment(department) {
      this.selectedDepartment = department
    },

    async fetchDepartments(params = {}) {
      try {
        this.loading = true
        const response = await departmentsApi.getAll(params)
        this.departments = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchDepartmentById(id) {
      try {
        this.loading = true
        const response = await departmentsApi.getById(id)
        this.departmentDetails = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createDepartment(data) {
      try {
        this.loading = true
        const response = await departmentsApi.create(data)
        this.departments.push(response.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateDepartment(id, data) {
      try {
        this.loading = true
        const response = await departmentsApi.update(id, data)
        const index = this.departments.findIndex(dep => dep.id === id)
        if (index !== -1) {
          this.departments[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteDepartment(id) {
      try {
        this.loading = true
        await departmentsApi.delete(id)
        const index = this.departments.findIndex(dep => dep.id === id)
        if (index !== -1) {
          this.departments.splice(index, 1)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 