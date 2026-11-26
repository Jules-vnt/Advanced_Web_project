<template>
  <div>
    <PageHeader
      :title="point ? point.name : loading ? 'Collection point' : 'Collection point not found'"
      description="Datasheet of a collection point."
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <router-link to="/collection-points" class="back-link">
        <i class="bi bi-arrow-left" aria-hidden="true"></i> All collection points
      </router-link>

      <div v-if="loading" class="text-center text-muted py-5">
        <div class="spinner-border" role="status" aria-hidden="true"></div>
        <p class="mt-2 mb-0">Loading the collection point...</p>
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
        Could not load the collection point: {{ error }}
      </div>

      <div v-else-if="point" class="sheet">
        <p class="point-type">
          <i :class="['bi', types[point.point_type].icon]" aria-hidden="true"></i>
          {{ types[point.point_type].label }}
        </p>

        <dl class="sheet-facts">
          <dt>ID</dt>
          <dd>#{{ point.point_id }}</dd>
          <dt>Name</dt>
          <dd>{{ point.name }}</dd>
          <dt>Address</dt>
          <dd>{{ point.address }}, {{ point.city }}</dd>
          <dt>Coordinates</dt>
          <dd>
            <span v-if="point.latitude == null || point.longitude == null" class="text-muted">—</span>
            <a v-else :href="mapUrl" target="_blank" rel="noopener">
              <i class="bi bi-geo-alt" aria-hidden="true"></i>
              {{ point.latitude }}, {{ point.longitude }}
            </a>
          </dd>
          <dt>Treatment center</dt>
          <dd>
            <router-link v-if="point.center_id" :to="'/treatment-centers/' + point.center_id">
              {{ point.center_name }}
            </router-link>
            <span v-else class="text-muted">None</span>
          </dd>
        </dl>

        <ItemActions
          base="/collection-points"
          :id="point.point_id"
          :name="point.name"
          hide-show
        />

        <section class="sheet-section">
          <h2>Collections at this point</h2>
          <ul v-if="collections.length" class="list-unstyled mb-0">
            <li v-for="c in collections" :key="c.collection_id" class="mb-1">
              <router-link :to="'/collections/' + c.collection_id">
                {{ formatDate(c.collection_date) }}
              </router-link>
              <span class="text-muted"> — {{ c.driver_name }}, {{ statuses[c.status] }}</span>
            </li>
          </ul>
          <p v-else class="text-muted mb-0">No collection round yet.</p>
        </section>
      </div>

      <p v-else class="text-muted">There is no collection point with the ID {{ $route.params.id }}.</p>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import ItemActions from '@/components/ItemActions.vue'
import pointTypes from '@/enums/pointTypes'
import collectionStatuses from '@/enums/collectionStatuses'
// Data comes from MySQL through the server:
// GET /api/collection-points/:id and GET /api/collection-points/:id/collections
import { collectionPointsApi } from '@/services/api'

export default {
  name: 'CollectionPointView',
  components: { PageHeader, ItemActions },
  data() {
    return {
      section: sections.find((s) => s.name === 'collection-points'),
      point: null,
      collections: [],
      types: pointTypes,
      statuses: collectionStatuses,
      loading: true,
      error: null
    }
  },
  computed: {
    mapUrl() {
      const p = this.point
      return `https://www.openstreetmap.org/?mlat=${p.latitude}&mlon=${p.longitude}#map=17/${p.latitude}/${p.longitude}`
    }
  },
  methods: {
    async getData() {
      this.loading = true
      this.error = null
      const id = this.$route.params.id
      try {
        const [point, collections] = await Promise.all([
          collectionPointsApi.getById(id),
          collectionPointsApi.getCollections(id)
        ])
        this.point = point
        this.collections = collections
      } catch (err) {
        // 404: the "no collection point" message is shown instead of an error
        if (err.status !== 404) {
          this.error = err.message
        }
        this.point = null
      } finally {
        this.loading = false
      }
    },
    formatDate(iso) {
      return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>
.sheet {
  border-top: 6px solid var(--accent);
}

.point-type {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
  padding: 0.2rem 0.8rem;
  border-radius: 999px;
  background: var(--paper);
  font-weight: 600;
}
</style>
