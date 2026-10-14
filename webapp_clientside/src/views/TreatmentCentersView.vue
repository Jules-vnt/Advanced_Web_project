<template>
  <div>
    <PageHeader
      :title="section.label"
      :description="section.description"
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <p class="text-muted">
        {{ centers.length }} treatment centers,
        {{ totalCapacity.toLocaleString('en-GB') }} tons of capacity in total.
      </p>

      <ul class="centers">
        <li v-for="c in centers" :key="c.center_id" class="center">
          <div class="center-head">
            <span class="center-city">{{ c.city }}</span>
            <span :class="['center-state', c.is_active ? 'on' : 'off']">
              {{ c.is_active ? 'Active' : 'Closed' }}
            </span>
          </div>

          <h2 class="center-title">{{ c.name }}</h2>
          <p class="text-muted small mb-3">
            <i class="bi bi-geo-alt" aria-hidden="true"></i> {{ c.address }}
          </p>

          <!-- Bar shows capacity relative to the largest center -->
          <div class="capacity">
            <div class="capacity-label">
              <span class="text-muted">Capacity</span>
              <strong>{{ c.capacity_tons.toLocaleString('en-GB') }} t</strong>
            </div>
            <div class="capacity-track">
              <div class="capacity-bar" :style="{ width: capacityPercent(c) + '%' }"></div>
            </div>
          </div>

          <dl class="center-facts">
            <dt>Opened</dt>
            <dd>{{ formatDate(c.opening_date) }}</dd>
            <dt>Collection points</dt>
            <dd>{{ pointCount(c.center_id) }}</dd>
            <dt>Collections</dt>
            <dd>{{ collectionCount(c.center_id) }}</dd>
          </dl>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
// Fake JSON data: same field names as the treatment_center, collection_point
// and collection tables
import centersData from '../../../data/treatment_centers.json'
import pointsData from '../../../data/collection_points.json'
import collectionsData from '../../../data/collections.json'

export default {
  name: 'TreatmentCentersView',
  components: { PageHeader },
  data() {
    return {
      section: sections.find((s) => s.name === 'treatment-centers'),
      centers: [],
      points: [],
      collections: []
    }
  },
  computed: {
    totalCapacity() {
      return this.centers.reduce((sum, c) => sum + c.capacity_tons, 0)
    },
    maxCapacity() {
      return Math.max(...this.centers.map((c) => c.capacity_tons))
    }
  },
  methods: {
    getAllData() {
      // Later: replaced by fetch() calls to the server
      this.centers = centersData
      this.points = pointsData
      this.collections = collectionsData
    },
    capacityPercent(center) {
      return Math.round((center.capacity_tons / this.maxCapacity) * 100)
    },
    pointCount(id) {
      return this.points.filter((p) => p.center_id === id).length
    },
    collectionCount(id) {
      return this.collections.filter((c) => c.center_id === id).length
    },
    formatDate(iso) {
      return new Date(iso).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      })
    }
  },
  created() {
    this.getAllData()
  }
}
</script>

<style scoped>
.centers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.center {
  padding: 1.25rem;
  border-top: 5px solid var(--moss);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.center-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.center-city {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--moss);
}

.center-state {
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.center-state.on {
  background: var(--accent);
  color: var(--ink);
}

.center-state.off {
  background: #e7e3d6;
  color: var(--muted);
}

.center-title {
  margin: 0.4rem 0 0.25rem;
  font-size: 1.2rem;
}

.capacity {
  margin-bottom: 1rem;
}

.capacity-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.capacity-track {
  height: 8px;
  border-radius: 999px;
  background: var(--paper);
}

.capacity-bar {
  height: 100%;
  border-radius: 999px;
  background: var(--moss);
}

.center-facts {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.35rem 1rem;
  margin: 0;
  padding-top: 0.75rem;
  border-top: 1px solid var(--line);
  font-size: 0.9rem;
}

.center-facts dt {
  font-weight: 400;
  color: var(--muted);
}

.center-facts dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}
</style>
