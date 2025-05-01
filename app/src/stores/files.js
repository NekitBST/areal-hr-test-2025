import { defineStore } from 'pinia'
import { filesApi } from '../services/api'

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: [],
    fileDetails: null,
    selectedFile: null,
    loading: false
  }),

  actions: {
    setSelectedFile(file) {
      this.selectedFile = file
    },

    async fetchFiles(params = {}) {
      this.loading = true
      try {
        const response = await filesApi.getAll(params)
        this.files = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchFileById(id) {
      this.loading = true
      try {
        const response = await filesApi.getById(id)
        this.fileDetails = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createFile(formData) {
      this.loading = true
      try {
        const response = await filesApi.create(formData)
        this.files.push(response.data)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateFile(id, data) {
      this.loading = true
      try {
        const response = await filesApi.update(id, data)
        const index = this.files.findIndex(file => file.id === id)
        if (index !== -1) {
          this.files[index] = response.data
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteFile(id) {
      this.loading = true
      try {
        await filesApi.delete(id)
        this.files = this.files.filter(file => file.id !== id)
        if (this.selectedFile?.id === id) {
          this.selectedFile = null
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 