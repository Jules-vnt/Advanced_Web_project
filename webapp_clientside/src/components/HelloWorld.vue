<template>
  <div class="container">
    <header class="hero">
      <div>
        <h1>{{ msg }}</h1>
        <p class="text-muted">
          Manage household waste collection and recycling: waste types,
          collection points, collection rounds and treatment centers.
        </p>
        <router-link to="/waste-types" class="btn-brand">See waste types</router-link>
      </div>
      <img :src="heroImg" alt="Yellow, blue, red and green wheelie bins against a wall" />
    </header>

    <h2 class="h4 mb-3">Sections</h2>
    <ul class="cards">
      <li v-for="item in sections" :key="item.to">
        <router-link :to="item.to" class="card-link">
          <img :src="item.image" :alt="item.imageAlt" />
          <div class="card-text">
            <h3 class="h5">{{ item.label }}</h3>
            <p class="text-muted mb-0">{{ item.description }}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import sections from '@/sections'
import heroImg from '@/assets/img/hero-bins.jpg'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      sections,
      heroImg
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
  padding: 3rem 0;
}

.hero h1 {
  font-size: 2.6rem;
  margin-bottom: 1rem;
}

.hero p {
  margin-bottom: 1.5rem;
}

.hero img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: var(--radius);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card-link {
  display: block;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
  color: inherit;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.card-link:hover {
  transform: translateY(-4px);
}

.card-link img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.card-text {
  padding: 1rem;
}

@media (max-width: 767.98px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 2rem 0;
  }

  .hero h1 {
    font-size: 2rem;
  }
}
</style>
