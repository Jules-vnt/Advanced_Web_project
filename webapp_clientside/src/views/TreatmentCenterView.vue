<template>
  <div>
    <PageHeader
      :title="center ? center.name : loading ? 'Treatment center' : 'Treatment center not found'"
      description="Datasheet of a treatment center."
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <router-link to="/treatment-centers" class="back-link">
        <i class="bi bi-arrow-left" aria-hidden="true"></i> All treatment centers
      </router-link>

      <div v-if="loading" class="text-center text-muted py-5">
        <div class="spinner-border" role="status" aria-hidden="true"></div>
        <p class="mt-2 mb-0">Loading the treatment center...</p>
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
        Could not load the treatment center: {{ error }}
      </div>

      <div v-else-if="center" class="sheet">
        <div class="center-head">
          <span class="center-city">{{ center.city }}</span>
          <span :class="['center-state', center.is_active ? 'on' : 'off']">
            {{ center.is_active ? 'Active' : 'Closed' }}
          </span>
        </div>

        <dl class="sheet-facts">
          <dt>ID</dt>
          <dd>#{{ center.center_id }}</dd>
          <dt>Name</dt>
          <dd>{{ center.name }}</dd>
          <dt>Address</dt>
          <dd>{{ center.address }}, {{ center.city }}</dd>
          <dt>Capacity</dt>
          <dd>{{ center.capacity_tons.toLocaleString('en-GB') }} tons</dd>
          <dt>Opened</dt>
          <dd>{{ formatDate(center.opening_date) }}</dd>
          <dt>Collections</dt>
          <dd>{{ center.collection_count }}</dd>
        </dl>

        <ItemActions
          base="/treatment-centers"
          :id="center.center_id"
          :name="center.name"
          hide-show
        />

        <section class="sheet-section">
          <h2>Collection points served</h2>
          <ul v-if="points.length" class="list-unstyled mb-0">
            <li v-for="p in points" :key="p.point_id" class="mb-1">
              <router-link :to="'/collection-points/' + p.point_id">{{ p.name }}</router-link>
              <span class="text-muted"> — {{ p.address }}, {{ p.city }}</span>
            </li>
          </ul>
          <p v-else class="text-muted mb-0">No collection point is linked to this center.</p>
        </section>
      </div>

      <p v-else class="text-muted">There is no treatment center with the ID {{ $route.params.id }}.</p>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import ItemActions from '@/components/ItemActions.vue'
// Data comes from MySQL through the server:
// GET /api/treatment-centers/:id and GET /api/treatment-centers/:id/collection-points
import { treatmentCentersApi } from '@/services/api'

export default {
  name: 'TreatmentCenterView',
  components: { PageHeader, ItemActions },
  data() {
    return {
      section: sections.find((s) => s.name === 'treatment-centers'),
      center: null,
      points: [],
      loading: true,
      error: null
    }
  },
  methods: {
    async getData() {
      this.loading = true
      this.error = null
      const id = this.$route.params.id
      try {
        const [center, points] = await Promise.all([
          treatmentCentersApi.getById(id),
          treatmentCentersApi.getPoints(id)
        ])
        this.center = center
        this.points = points
      } catch (err) {
        // 404: the "no treatment center" message is shown instead of an error
        if (err.status !== 404) {
          this.error = err.message
        }
        this.center = null
      } finally {
        this.loading = false
      }
    },
    formatDate(iso) {
      if (!iso) {
        return '-'
      }
      return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
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
  border-top: 6px solid var(--moss);
}

.center-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.center-city {
  font-size: 0.8rem;
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
</style>
