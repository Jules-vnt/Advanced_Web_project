<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <AppNavbar />
  <main id="main">
    <router-view />
  </main>
  <AppFooter />
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter
  }
}
</script>

<style>
#app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

#main {
  flex: 1;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -3rem;
  z-index: calc(var(--z-nav) + 1);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: var(--ink);
  font-weight: 600;
  transition: top 0.2s var(--ease);
}

.skip-link:focus {
  top: 1rem;
}
</style>
