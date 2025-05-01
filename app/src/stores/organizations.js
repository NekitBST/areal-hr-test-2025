import { defineStore } from 'pinia'
import { organizationsApi } from '../services/api'

export const useOrganizationsStore = defineStore('organizations', {
  state: () => ({
    organizations: [],
    selectedOrganization: null,
    loading: false,
    organizationDetails: null
  }),

  actions: {
    async fetchOrganizations(params = {}) {
      this.loading = true
      try {
        const response = await organizationsApi.getAll(params)
        this.organizations = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchOrganizationById(id) {
      this.loading = true
      try {
        const response = await organizationsApi.getById(id)
        this.organizationDetails = response.data
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createOrganization(data) {
      this.loading = true
      try {
        const response = await organizationsApi.create(data)
        this.organizations.push(response.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateOrganization(id, data) {
      this.loading = true
      try {
        const response = await organizationsApi.update(id, data)
        const index = this.organizations.findIndex(org => org.id === id)
        if (index !== -1) {
          this.organizations[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteOrganization(id) {
      this.loading = true
      try {
        await organizationsApi.delete(id)
        const index = this.organizations.findIndex(org => org.id === id)
        if (index !== -1) {
          this.organizations.splice(index, 1)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedOrganization(organization) {
      this.selectedOrganization = organization
    }
  }
}) 