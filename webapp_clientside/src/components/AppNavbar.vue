<template>
  <nav class="navbar navbar-expand-lg navbar-dark app-nav">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="bi bi-recycle" aria-hidden="true"></i> Waste &amp; Recycling
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainMenu"
        aria-controls="mainMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="mainMenu" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li v-for="item in sections" :key="item.to" class="nav-item">
            <router-link class="nav-link" :to="item.to">{{ item.label }}</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/logout">Logout</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import sections from '@/sections'

export default {
  name: 'AppNavbar',
  data() {
    return { sections }
  }
}
</script>

<style scoped>
.app-nav {
  background: var(--ink);
}

.nav-link.router-link-active {
  color: var(--accent) !important;
  font-weight: 600;
}
</style>
