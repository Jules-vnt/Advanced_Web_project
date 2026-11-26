<template>
  <div>
    <PageHeader
      :title="section.label"
      :description="section.description"
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <div class="list-toolbar">
        <p v-if="!loading && !error" class="text-muted mb-0">
          {{ centers.length }} treatment centers,
          {{ totalCapacity.toLocaleString('en-GB') }} tons of capacity in total.
        </p>
        <p v-else class="mb-0"></p>
        <router-link to="/treatment-centers/new" class="btn-brand">
          <i class="bi bi-plus-lg" aria-hidden="true"></i> New treatment center
        </router-link>
      </div>

      <!-- Waiting for the server -->
      <div v-if="loading" class="text-center text-muted py-5">
        <div class="spinner-border" role="status" aria-hidden="true"></div>
        <p class="mt-2 mb-0">Loading the treatment centers...</p>
      </div>

      <!-- The server or the database did not answer -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
        Could not load the treatment centers: {{ error }}
        <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="getAllData">
          Try again
        </button>
      </div>

      <ul v-else class="centers">
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
            <dd>{{ c.point_count }}</dd>
            <dt>Collections</dt>
            <dd>{{ c.collection_count }}</dd>
          </dl>

          <ItemActions
            base="/treatment-centers"
            :id="c.center_id"
            :name="c.name"
            class="center-actions"
            @deleted="getAllData"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import ItemActions from '@/components/ItemActions.vue'
// Data now comes from MySQL through the server (GET /api/treatment-centers).
// point_count and collection_count are computed by the SQL query.
import { treatmentCentersApi } from '@/services/api'

export default {
  name: 'TreatmentCentersView',
  components: { PageHeader, ItemActions },
  data() {
    return {
      section: sections.find((s) => s.name === 'treatment-centers'),
      centers: [],
      loading: true,
      error: null
    }
  },
  computed: {
    totalCapacity() {
      return this.centers.reduce((sum, c) => sum + c.capacity_tons, 0)
    },
    maxCapacity() {
      return Math.max(1, ...this.centers.map((c) => c.capacity_tons))
    }
  },
  methods: {
    async getAllData() {
      this.loading = true
      this.error = null
      try {
        this.centers = await treatmentCentersApi.getAll()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    capacityPercent(center) {
      return Math.round((center.capacity_tons / this.maxCapacity) * 100)
    },
    formatDate(iso) {
      if (!iso) {
        return '-'
      }
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

.center-actions {
  margin-top: 1rem;
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
