<template>
  <section class="page-header container">
    <div class="banner rise">
      <img :src="image" :alt="imageAlt" class="banner-img" />
      <div class="banner-shade"></div>

      <div class="banner-content">
        <router-link to="/" class="crumb">
          <i class="bi bi-arrow-left" aria-hidden="true"></i> Home
        </router-link>
        <div class="d-flex align-items-end gap-3 flex-wrap">
          <span class="banner-icon"><i :class="['bi', icon]" aria-hidden="true"></i></span>
          <div>
            <h1 class="banner-title">{{ title }}</h1>
            <p v-if="description" class="banner-desc">{{ description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: { type: String, required: true },
    description: String,
    icon: { type: String, default: 'bi-recycle' },
    image: { type: String, required: true },
    imageAlt: { type: String, default: '' }
  }
}
</script>

<style scoped>
.page-header {
  padding-top: 1.5rem;
}

.banner {
  position: relative;
  min-height: 300px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  box-shadow: var(--shadow);
}

.banner-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.04);
  animation: settle 1.6s var(--ease) forwards;
}

@keyframes settle {
  to {
    transform: scale(1);
  }
}

.banner-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(19, 36, 26, 0.92) 0%, rgba(19, 36, 26, 0.55) 55%, rgba(19, 36, 26, 0.15) 100%),
    radial-gradient(120% 80% at 0% 100%, rgba(19, 36, 26, 0.6), transparent 60%);
}

.banner-content {
  position: relative;
  width: 100%;
  padding: 1.5rem 2rem 2.25rem;
  color: #fff;
}

.crumb {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 3.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: background-color 0.2s var(--ease);
}

.crumb:hover {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}

.banner-icon {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  flex-shrink: 0;
  border-radius: 1.1rem;
  background: var(--accent);
  color: var(--ink);
  font-size: 1.8rem;
  transform: rotate(-6deg);
}

.banner-title {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 800;
}

.banner-desc {
  margin: 0.5rem 0 0;
  max-width: 34rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.05rem;
}

@media (max-width: 575.98px) {
  .banner-content {
    padding: 1.25rem 1.25rem 1.5rem;
  }

  .crumb {
    margin-bottom: 2rem;
  }
}
</style>
