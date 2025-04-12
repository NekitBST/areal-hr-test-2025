<script setup>

</script>

<template>
  <div class="app">
    <nav class="navbar">
      <router-link to="/" class="nav-link">Главная</router-link>
      <router-link to="/organizations" class="nav-link">Организации</router-link>
      <router-link to="/positions" class="nav-link">Должности</router-link>
      <router-link to="/departments" class="nav-link">Отделы</router-link>
      <router-link to="/employees" class="nav-link">Сотрудники</router-link>
      <router-link to="/files" class="nav-link">Файлы</router-link>
      <router-link to="/hr-operations" class="nav-link">HR-операции</router-link>
      <router-link to="/change-history" class="nav-link">История изменений</router-link>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
    <Toast />
  </div>
</template>

