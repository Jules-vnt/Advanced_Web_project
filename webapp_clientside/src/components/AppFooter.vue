<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <div>
          <p class="footer-title">Waste <em>&amp;</em> Recycling Management</p>
          <p class="footer-sub">A database and web application for household waste collection and recycling.</p>
        </div>
        <ul class="footer-links">
          <li v-for="item in sections" :key="item.to">
            <router-link :to="item.to">
              <i :class="['bi', item.icon]" aria-hidden="true"></i> {{ item.label }}
            </router-link>
          </li>
        </ul>
      </div>
      <p class="footer-credits">
        Jules Venot · Amadeo Berthelot · Hadi Daccache — Advanced Web project
      </p>
    </div>
  </footer>
</template>

<script>
import sections from '@/sections'

export default {
  name: 'AppFooter',
  data() {
    return { sections }
  }
}
</script>

<style scoped>
.site-footer {
  margin-top: 5rem;
  padding: 3.5rem 0 2rem;
  background: var(--ink);
  color: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-title {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
}

.footer-title em {
  font-style: normal;
  color: var(--accent);
}

.footer-sub {
  max-width: 26rem;
  margin: 0;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.6rem 2.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s var(--ease);
}

.footer-links a:hover {
  color: var(--accent);
}

.footer-links .bi {
  margin-right: 0.35rem;
}

.footer-credits {
  margin: 1.5rem 0 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
}
</style>
