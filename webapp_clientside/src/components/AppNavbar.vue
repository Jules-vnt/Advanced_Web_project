<template>
  <header class="site-header">
    <nav class="navbar navbar-expand-lg navbar-dark app-nav">
      <div class="container-fluid px-2">
        <router-link class="navbar-brand brand" to="/">
          <span class="brand-mark"><i class="bi bi-recycle" aria-hidden="true"></i></span>
          <span class="brand-text">Waste <em>&amp;</em> Recycling</span>
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
          <i class="bi bi-list" aria-hidden="true"></i>
        </button>

        <div id="mainMenu" ref="menu" class="collapse navbar-collapse">
          <ul class="navbar-nav mx-auto gap-lg-1">
            <li v-for="item in sections" :key="item.to" class="nav-item">
              <router-link class="nav-link" :to="item.to">
                <i :class="['bi', item.icon]" aria-hidden="true"></i>
                {{ item.label }}
              </router-link>
            </li>
          </ul>
          <div class="d-flex gap-2 py-2 py-lg-0">
            <router-link class="nav-login" to="/login">
              <i class="bi bi-person-circle" aria-hidden="true"></i> Login
            </router-link>
            <router-link class="nav-logout" to="/logout" title="Logout" aria-label="Logout">
              <i class="bi bi-box-arrow-right" aria-hidden="true"></i>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import sections from '@/sections'

export default {
  name: 'AppNavbar',
  data() {
    return { sections }
  },
  watch: {
    // Close the mobile menu after navigating
    $route() {
      const menu = this.$refs.menu
      if (menu && menu.classList.contains('show') && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide()
      }
    }
  }
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
  padding: 0.75rem 1rem 0;
}

.app-nav {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0.5rem 0.6rem;
  border-radius: 999px;
  background: rgba(19, 36, 26, 0.88);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), var(--shadow);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
}

.brand em {
  font-style: normal;
  color: var(--accent);
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 50%;
  background: var(--accent);
  color: var(--ink);
  font-size: 1.15rem;
  transition: transform 0.6s var(--ease);
}

.brand:hover .brand-mark {
  transform: rotate(-180deg);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.9rem !important;
  border-radius: 999px;
  font-weight: 500;
  font-size: 0.93rem;
  color: rgba(255, 255, 255, 0.72) !important;
  transition: background-color 0.2s var(--ease), color 0.2s var(--ease);
}

.nav-link .bi {
  font-size: 0.95rem;
  opacity: 0.8;
}

.nav-link:hover {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.07);
}

.nav-link.router-link-active {
  color: var(--ink) !important;
  background: var(--accent);
}

.nav-link.router-link-active .bi {
  opacity: 1;
}

.nav-login,
.nav-logout {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  height: 2.5rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: transform 0.2s var(--ease), background-color 0.2s var(--ease);
}

.nav-login {
  padding: 0 1.1rem;
  background: #fff;
  color: var(--ink);
}

.nav-logout {
  width: 2.5rem;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-login:hover,
.nav-logout:hover {
  transform: translateY(-1px);
}

.nav-logout:hover {
  background: rgba(255, 255, 255, 0.1);
}

.navbar-toggler {
  border: 0;
  color: #fff;
  font-size: 1.6rem;
  padding: 0.1rem 0.6rem;
}

.navbar-toggler:focus {
  box-shadow: none;
}

@media (max-width: 991.98px) {
  .app-nav {
    border-radius: var(--radius);
  }

  .navbar-nav {
    padding-top: 0.75rem;
  }
}
</style>
