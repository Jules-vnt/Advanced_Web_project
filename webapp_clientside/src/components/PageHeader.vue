<template>
  <header class="page-header">
    <img :src="image" :alt="imageAlt" />
    <div class="page-header-text">
      <h1>{{ title }}</h1>
      <p v-if="description" class="mb-0">{{ description }}</p>
    </div>
  </header>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: { type: String, required: true },
    description: String,
    image: { type: String, required: true },
    imageAlt: { type: String, default: '' }
  }
}
</script>

<style scoped>
.page-header {
  position: relative;
  margin-bottom: 2rem;
}

.page-header img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.page-header-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 2rem;
  background: linear-gradient(90deg, rgba(29, 54, 39, 0.9), rgba(29, 54, 39, 0.45));
  color: #fff;
}

.page-header h1 {
  font-size: 2.4rem;
}

@media (max-width: 575.98px) {
  .page-header-text {
    padding: 0 1rem;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }
}
</style>
