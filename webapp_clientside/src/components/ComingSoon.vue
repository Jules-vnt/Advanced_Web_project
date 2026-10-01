<template>
  <section class="container py-5">
    <div class="soon rise" style="--i: 2">
      <div class="soon-art" aria-hidden="true">
        <span class="ring"></span>
        <span class="ring ring-2"></span>
        <i :class="['bi', icon]"></i>
      </div>
      <div>
        <span class="eyebrow">In progress</span>
        <h2 class="soon-title">{{ title }}</h2>
        <p class="text-muted mb-4">
          <slot>This section is being built. Data will show up here once it is connected to the API.</slot>
        </p>
        <div class="d-flex flex-wrap gap-2">
          <router-link to="/" class="btn-brand">
            <i class="bi bi-house-door" aria-hidden="true"></i> Back home
          </router-link>
          <router-link
            v-for="item in others"
            :key="item.to"
            :to="item.to"
            class="btn-ghost"
          >
            <i :class="['bi', item.icon]" aria-hidden="true"></i> {{ item.label }}
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import sections from '@/sections'

export default {
  name: 'ComingSoon',
  props: {
    title: { type: String, default: 'Coming soon' },
    icon: { type: String, default: 'bi-hourglass-split' }
  },
  computed: {
    others() {
      return sections.filter((s) => s.name !== this.$route.name).slice(0, 2)
    }
  }
}
</script>

<style scoped>
.soon {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2.5rem;
  align-items: center;
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px dashed rgba(19, 36, 26, 0.2);
}

.soon-title {
  margin: 0.6rem 0 0.5rem;
  font-size: 1.9rem;
}

.soon p {
  max-width: 34rem;
}

.soon-art {
  position: relative;
  display: grid;
  place-items: center;
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  background: var(--paper-2);
  color: var(--moss);
  font-size: 3rem;
}

.ring {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 2px dashed var(--leaf);
  opacity: 0.45;
  animation: spin 18s linear infinite;
}

.ring-2 {
  inset: 14px;
  border-style: dotted;
  animation-direction: reverse;
  animation-duration: 12s;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 767.98px) {
  .soon {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.75rem;
  }

  .soon-art {
    width: 6.5rem;
    height: 6.5rem;
    font-size: 2.2rem;
  }
}
</style>
