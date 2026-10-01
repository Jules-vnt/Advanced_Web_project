<template>
  <div class="opener">
    <nav class="navbar navbar-expand-lg navbar-dark bg-success">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/">♻ {{ msg }}</router-link>
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
            <li v-for="item in menuItems" :key="item.to" class="nav-item">
              <router-link class="nav-link" :to="item.to">{{ item.label }}</router-link>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="btn btn-light btn-sm me-2" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="btn btn-outline-light btn-sm" to="/logout">Logout</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <header class="hero text-center py-5">
      <div class="container">
        <h1 class="display-5 fw-bold">{{ msg }}</h1>
        <p class="lead mx-auto">
          Manage household waste collection and recycling: waste types,
          collection points, collection rounds and treatment centers.
        </p>
      </div>
    </header>

    <main class="container pb-5">
      <section class="story-strip row g-3 mb-5" aria-label="Recycling in action">
        <div v-for="image in images" :key="image.title" class="col-12 col-md-4">
          <div class="story-image">
            <img :src="image.src" :alt="image.alt">
            <div class="story-caption">{{ image.title }}</div>
          </div>
        </div>
      </section>

      <div class="row g-4">
        <div v-for="item in menuItems" :key="item.to" class="col-12 col-sm-6 col-lg-3">
          <router-link :to="item.to" class="card h-100 text-decoration-none entity-card">
            <div class="card-body">
              <div class="entity-icon mb-3">{{ item.icon }}</div>
              <h5 class="card-title text-dark">{{ item.label }}</h5>
              <p class="card-text text-muted">{{ item.description }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      images: [
        {
          title: 'Sort smarter',
          alt: 'Sorted recycling containers',
          src: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80'
        },
        {
          title: 'Collect locally',
          alt: 'Recycling bins ready for collection',
          src: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=900&q=80'
        },
        {
          title: 'Give materials a future',
          alt: 'Recycled materials prepared for reuse',
          src: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=900&q=80'
        }
      ],
      menuItems: [
        {
          to: '/waste-types',
          label: 'List waste types',
          icon: '🗂',
          description: 'Categories of waste and how each one is recycled.'
        },
        {
          to: '/collection-points',
          label: 'List collection points',
          icon: '📍',
          description: 'Bins and drop-off locations across the city.'
        },
        {
          to: '/collections',
          label: 'List collections',
          icon: '🚛',
          description: 'Collection rounds with dates and collected quantities.'
        },
        {
          to: '/treatment-centers',
          label: 'List treatment centers',
          icon: '🏭',
          description: 'Sites where collected waste is sorted and processed.'
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hero {
  background: linear-gradient(180deg, #e8f5ee 0%, #ffffff 100%);
  margin-bottom: 2rem;
}

.hero .lead {
  max-width: 40rem;
}

.navbar .nav-link.router-link-active {
  color: #fff;
  font-weight: 600;
}

.entity-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.entity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.story-image {
  position: relative;
  overflow: hidden;
  min-height: 180px;
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1.25rem rgba(20, 67, 45, 0.12);
}

.story-image img {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.story-image:hover img {
  transform: scale(1.05);
}

.story-caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 2.5rem 1rem 0.8rem;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(transparent, rgba(12, 45, 30, 0.8));
}

.entity-icon {
  font-size: 2rem;
}
</style>
