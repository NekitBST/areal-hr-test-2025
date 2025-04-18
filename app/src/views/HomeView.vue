<template>
  <div class="home">
    <h1>Система управления персоналом</h1>
    <div class="cards">
      <router-link to="/organizations" class="card">
        <i class="pi pi-building"></i>
        <h3>Организации</h3>
        <p>Управление организациями</p>
      </router-link>
      <router-link to="/positions" class="card">
        <i class="pi pi-briefcase"></i>
        <h3>Должности</h3>
        <p>Управление должностями</p>
      </router-link>
      <router-link to="/departments" class="card">
        <i class="pi pi-sitemap"></i>
        <h3>Отделы</h3>
        <p>Управление отделами</p>
      </router-link>
      <router-link to="/employees" class="card">
        <i class="pi pi-users"></i>
        <h3>Сотрудники</h3>
        <p>Управление сотрудниками</p>
      </router-link>
      <router-link to="/files" class="card">
        <i class="pi pi-file"></i>
        <h3>Файлы</h3>
        <p>Управление файлами</p>
      </router-link>
      <router-link to="/hr-operations" class="card">
        <i class="pi pi-cog"></i>
        <h3>HR-операции</h3>
        <p>Управление HR-операциями</p>
      </router-link>
      <router-link to="/change-history" class="card">
        <i class="pi pi-history"></i>
        <h3>История изменений</h3>
        <p>История изменений</p>
      </router-link>
      <router-link to="/users" class="card">
        <i class="pi pi-user-edit"></i>
        <h3>Пользователи</h3>
        <p>Управление пользователями</p>
      </router-link>
    </div>
  </div>
</template> 