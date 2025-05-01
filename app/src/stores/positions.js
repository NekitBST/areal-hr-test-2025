import { defineStore } from 'pinia'
import { positionsApi } from '../services/api'

export const usePositionsStore = defineStore('positions', {
  state: () => ({
    positions: [],
    selectedPosition: null,
    loading: false,
    positionDetails: null
  }),

  actions: {
    async fetchPositions(params = {}) {
      this.loading = true
      try {
        const response = await positionsApi.getAll(params)
        this.positions = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPositionById(id) {
      this.loading = true
      try {
        const response = await positionsApi.getById(id)
        this.positionDetails = response.data
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createPosition(data) {
      this.loading = true
      try {
        const response = await positionsApi.create(data)
        this.positions.push(response.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePosition(id, data) {
      this.loading = true
      try {
        const response = await positionsApi.update(id, data)
        const index = this.positions.findIndex(pos => pos.id === id)
        if (index !== -1) {
          this.positions[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePosition(id) {
      this.loading = true
      try {
        await positionsApi.delete(id)
        const index = this.positions.findIndex(pos => pos.id === id)
        if (index !== -1) {
          this.positions.splice(index, 1)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedPosition(position) {
      this.selectedPosition = position
    }
  }
}) 