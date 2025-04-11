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
    </div>
  </div>
</template> 