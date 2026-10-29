<template>
  <div>
    <PageHeader
      :title="center ? center.name : 'Treatment center not found'"
      description="Datasheet of a treatment center."
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <router-link to="/treatment-centers" class="back-link">
        <i class="bi bi-arrow-left" aria-hidden="true"></i> All treatment centers
      </router-link>

      <div v-if="center" class="sheet">
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
          <dd>{{ collectionCount }}</dd>
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
// Fake JSON data: same field names as the treatment_center, collection_point
// and collection tables
import centersData from '../../../data/treatment_centers.json'
import pointsData from '../../../data/collection_points.json'
import collectionsData from '../../../data/collections.json'

export default {
  name: 'TreatmentCenterView',
  components: { PageHeader, ItemActions },
  data() {
    return {
      section: sections.find((s) => s.name === 'treatment-centers'),
      center: null,
      points: [],
      collectionCount: 0
    }
  },
  methods: {
    getData() {
      // Later: replaced by fetch() calls to the server
      const id = Number(this.$route.params.id)
      this.center = centersData.find((c) => c.center_id === id) || null
      this.points = pointsData.filter((p) => p.center_id === id)
      this.collectionCount = collectionsData.filter((c) => c.center_id === id).length
    },
    formatDate(iso) {
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
