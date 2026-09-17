<template>
  <nav v-if="$route.name !== 'home'" class="container py-3 text-start">
    <router-link to="/">&larr; Home</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav a {
  font-weight: bold;
  color: #198754;
}
</style>
