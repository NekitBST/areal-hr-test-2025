<script setup>
import { useAuthStore } from './stores/auth'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { onMounted, ref } from 'vue'

const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <div class="app">
    <nav class="navbar" v-if="authStore.isAuthenticated">
      <button class="mobile-menu-button" @click="toggleMobileMenu">
        <i :class="['pi', isMobileMenuOpen ? 'pi-times' : 'pi-bars']"></i>
      </button>
      
      <div class="nav-links" :class="{ mobile: isMobileMenuOpen }">
        <router-link to="/" class="nav-link" @click="isMobileMenuOpen = false">
          <i class="pi pi-home"></i>
          Главная
        </router-link>
        <router-link to="/organizations" class="nav-link" @click="isMobileMenuOpen = false">
          <i class="pi pi-building"></i>
          Организации
        </router-link>
        <router-link to="/positions" class="nav-link" @click="isMobileMenuOpen = false">
          <i class="pi pi-briefcase"></i>
          Должности
        </router-link>
        <router-link to="/departments" class="nav-link" @click="isMobileMenuOpen = false">
          <i class="pi pi-sitemap"></i>
          Отделы
        </router-link>
        <router-link to="/employees" class="nav-link" @click="isMobileMenuOpen = false">
          <i class="pi pi-users"></i>
          Сотрудники
        </router-link>
        <router-link to="/files" class="nav-link" @click="isMobileMenuOpen = false">
          <i class="pi pi-file"></i>
          Файлы
        </router-link>
        <router-link to="/hr-operations" class="nav-link" @click="isMobileMenuOpen = false">
          <i class="pi pi-cog"></i>
          HR-операции
        </router-link>
        <router-link to="/change-history" class="nav-link" @click="isMobileMenuOpen = false">
          <i class="pi pi-history"></i>
          История изменений
        </router-link>
        <router-link 
          v-if="authStore.isAdmin" 
          to="/users" 
          class="nav-link"
          @click="isMobileMenuOpen = false"
        >
          <i class="pi pi-user-edit"></i>
          Пользователи
        </router-link>
      </div>
      <div class="user-info">
        <div>
          <span class="user-name">{{ authStore.fullName }}</span>
          <span class="user-role">{{ authStore.user?.role_name }}</span>
        </div>
        <Button 
          icon="pi pi-sign-out" 
          class="p-button-text logout-button" 
          @click="authStore.logout"
          aria-label="Выйти"
        />
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
    <Toast />
  </div>
</template>