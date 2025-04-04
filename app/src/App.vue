<script setup>

</script>

<template>
  <div class="app">
    <nav class="navbar">
      <router-link to="/" class="nav-link">Главная</router-link>
      <router-link to="/organizations" class="nav-link">Организации</router-link>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
    <Toast />
  </div>
</template>

