import { defineStore } from 'pinia'
import { usersApi } from '../services/api'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    selectedUser: null,
    loading: false,
    userDetails: null
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        const response = await usersApi.getAll()
        this.users = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(id) {
      this.loading = true
      try {
        const response = await usersApi.getById(id)
        this.userDetails = response.data
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(data) {
      this.loading = true
      try {
        const response = await usersApi.create(data)
        const newUser = response.data
        const users = [...this.users]
        users.push(newUser)
        this.users = users
        return newUser
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(id, data) {
      this.loading = true
      try {
        const response = await usersApi.update(id, data)
        const updatedUser = response.data
        const users = [...this.users]
        const index = users.findIndex(user => user.id === id)
        if (index !== -1) {
          users[index] = updatedUser
          this.users = users
        }
        return updatedUser
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id) {
      this.loading = true
      try {
        await usersApi.delete(id)
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users.splice(index, 1)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedUser(user) {
      this.selectedUser = user
    }
  }
}) 