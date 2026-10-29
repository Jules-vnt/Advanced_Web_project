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
        <p class="text-muted mb-0">
          {{ filteredPoints.length }} of {{ points.length }} collection points
        </p>

        <div class="toolbar-right">
          <label class="toolbar-filter">
            <span class="text-muted">Type</span>
            <select v-model="typeFilter" class="form-select form-select-sm">
              <option value="">All types</option>
              <option v-for="(t, type) in types" :key="type" :value="type">
                {{ t.label }}
              </option>
            </select>
          </label>

          <router-link to="/collection-points/new" class="btn-brand">
            <i class="bi bi-plus-lg" aria-hidden="true"></i> New collection point
          </router-link>
        </div>
      </div>

      <div class="table-card">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Address</th>
              <th scope="col">Treatment center</th>
              <th scope="col">Map</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filteredPoints" :key="p.point_id">
              <td class="text-muted">{{ p.point_id }}</td>
              <td class="fw-semibold">{{ p.name }}</td>
              <td>
                <span :class="['type-pill', p.point_type]">
                  <i :class="['bi', types[p.point_type].icon]" aria-hidden="true"></i>
                  {{ types[p.point_type].label }}
                </span>
              </td>
              <td>
                {{ p.address }}<br />
                <span class="text-muted small">{{ p.city }}</span>
              </td>
              <td>{{ centerName(p.center_id) }}</td>
              <td>
                <a
                  :href="mapUrl(p)"
                  target="_blank"
                  rel="noopener"
                  :aria-label="'Open ' + p.name + ' on OpenStreetMap'"
                >
                  <i class="bi bi-geo-alt" aria-hidden="true"></i>
                  {{ p.latitude.toFixed(3) }}, {{ p.longitude.toFixed(3) }}
                </a>
              </td>
              <td>
                <ItemActions base="/collection-points" :id="p.point_id" :name="p.name" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import ItemActions from '@/components/ItemActions.vue'
import pointTypes from '@/enums/pointTypes'
// Fake JSON data: same field names as the collection_point and treatment_center tables
import pointsData from '../../../data/collection_points.json'
import centersData from '../../../data/treatment_centers.json'

export default {
  name: 'CollectionPointsView',
  components: { PageHeader, ItemActions },
  data() {
    return {
      section: sections.find((s) => s.name === 'collection-points'),
      points: [],
      centers: [],
      typeFilter: '',
      types: pointTypes
    }
  },
  computed: {
    filteredPoints() {
      if (!this.typeFilter) return this.points
      return this.points.filter((p) => p.point_type === this.typeFilter)
    }
  },
  methods: {
    getAllData() {
      // Later: replaced by a fetch() call to the server
      this.points = pointsData
      this.centers = centersData
    },
    centerName(id) {
      const center = this.centers.find((c) => c.center_id === id)
      return center ? center.name : '—'
    },
    mapUrl(p) {
      return `https://www.openstreetmap.org/?mlat=${p.latitude}&mlon=${p.longitude}#map=17/${p.latitude}/${p.longitude}`
    }
  },
  created() {
    this.getAllData()
  }
}
</script>

<style scoped>
.toolbar-right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.toolbar-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-filter select {
  width: auto;
}

.table-card {
  overflow-x: auto;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.table th {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}

.table td,
.table th {
  padding: 0.8rem 1rem;
}

.type-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.65rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  background: #e7e3d6;
}

.type-pill.street_bin {
  background: var(--accent);
}

.type-pill.drop_off_center {
  background: #cfe3d6;
}

.type-pill.container {
  background: #f0dcb4;
}
</style>
