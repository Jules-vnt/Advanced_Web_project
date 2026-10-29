<template>
  <div>
    <PageHeader
      :title="section.label"
      :description="section.description"
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <ul class="stats">
        <li>
          <span class="stat-value">{{ formatKg(totalKg) }}</span>
          <span class="text-muted">collected in total</span>
        </li>
        <li>
          <span class="stat-value">{{ sortedPercent }} %</span>
          <span class="text-muted">of the weight was sorted</span>
        </li>
        <li>
          <span class="stat-value">{{ countByStatus('completed') }} / {{ collections.length }}</span>
          <span class="text-muted">rounds completed</span>
        </li>
      </ul>

      <div class="list-toolbar">
        <p class="text-muted mb-0">
          {{ filteredCollections.length }} of {{ collections.length }} collection rounds
        </p>

        <div class="toolbar-right">
          <label class="toolbar-filter">
            <span class="text-muted">Status</span>
            <select v-model="statusFilter" class="form-select form-select-sm">
              <option value="">All statuses</option>
              <option v-for="(label, status) in statuses" :key="status" :value="status">
                {{ label }}
              </option>
            </select>
          </label>

          <router-link to="/collections/new" class="btn-brand">
            <i class="bi bi-plus-lg" aria-hidden="true"></i> New collection
          </router-link>
        </div>
      </div>

      <div class="table-card">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Collection point</th>
              <th scope="col">Treatment center</th>
              <th scope="col">Driver / vehicle</th>
              <th scope="col">Status</th>
              <th scope="col">Waste collected</th>
              <th scope="col" class="text-end">Total</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filteredCollections" :key="c.collection_id">
              <td class="text-muted">{{ c.collection_id }}</td>
              <td class="text-nowrap">{{ formatDate(c.collection_date) }}</td>
              <td class="fw-semibold">{{ pointName(c.point_id) }}</td>
              <td>{{ centerName(c.center_id) }}</td>
              <td>
                {{ c.driver_name }}<br />
                <span class="text-muted small">{{ c.vehicle_plate }}</span>
              </td>
              <td>
                <span :class="['status-pill', c.status]">{{ statuses[c.status] }}</span>
              </td>
              <td>
                <!-- One chip per collection_waste row, coloured with the waste type's color_code -->
                <ul v-if="wasteLines(c.collection_id).length" class="chips">
                  <li
                    v-for="line in wasteLines(c.collection_id)"
                    :key="line.waste_type_id"
                    class="chip"
                    :style="{ '--chip': wasteType(line.waste_type_id).color_code }"
                    :title="line.is_sorted ? 'Sorted' : 'Not sorted'"
                  >
                    {{ wasteType(line.waste_type_id).label }}
                    <strong>{{ formatKg(line.quantity_kg) }}</strong>
                  </li>
                </ul>
                <span v-else class="text-muted small">Nothing recorded yet</span>
              </td>
              <td class="text-end fw-semibold text-nowrap">{{ formatKg(collectionKg(c.collection_id)) }}</td>
              <td>
                <ItemActions
                  base="/collections"
                  :id="c.collection_id"
                  :name="'collection ' + c.collection_id"
                />
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
import collectionStatuses from '@/enums/collectionStatuses'
// Fake JSON data: same field names as the collection, collection_waste,
// collection_point, treatment_center and waste_type tables
import collectionsData from '../../../data/collections.json'
import wasteLinesData from '../../../data/waste_collection.json'
import pointsData from '../../../data/collection_points.json'
import centersData from '../../../data/treatment_centers.json'
import wasteTypesData from '../../../data/waste_types.json'

export default {
  name: 'CollectionsView',
  components: { PageHeader, ItemActions },
  data() {
    return {
      section: sections.find((s) => s.name === 'collections'),
      collections: [],
      wasteLinesAll: [],
      points: [],
      centers: [],
      wasteTypes: [],
      statusFilter: '',
      statuses: collectionStatuses
    }
  },
  computed: {
    filteredCollections() {
      if (!this.statusFilter) return this.collections
      return this.collections.filter((c) => c.status === this.statusFilter)
    },
    // SUM(quantity_kg) over every collection_waste row
    totalKg() {
      return this.wasteLinesAll.reduce((sum, l) => sum + l.quantity_kg, 0)
    },
    sortedPercent() {
      if (!this.totalKg) return 0
      const sortedKg = this.wasteLinesAll
        .filter((l) => l.is_sorted)
        .reduce((sum, l) => sum + l.quantity_kg, 0)
      return Math.round((sortedKg / this.totalKg) * 100)
    }
  },
  methods: {
    getAllData() {
      // Later: replaced by fetch() calls to the server
      this.collections = collectionsData
      this.wasteLinesAll = wasteLinesData
      this.points = pointsData
      this.centers = centersData
      this.wasteTypes = wasteTypesData
    },
    countByStatus(status) {
      return this.collections.filter((c) => c.status === status).length
    },
    // collection_waste rows of one collection (JOIN on collection_id)
    wasteLines(id) {
      return this.wasteLinesAll.filter((l) => l.collection_id === id)
    },
    // SUM(quantity_kg) ... GROUP BY collection_id
    collectionKg(id) {
      return this.wasteLines(id).reduce((sum, l) => sum + l.quantity_kg, 0)
    },
    wasteType(id) {
      return this.wasteTypes.find((w) => w.waste_type_id === id) || { label: '—', color_code: '#999999' }
    },
    pointName(id) {
      const point = this.points.find((p) => p.point_id === id)
      return point ? point.name : '—'
    },
    centerName(id) {
      const center = this.centers.find((c) => c.center_id === id)
      return center ? center.name : '—'
    },
    formatKg(kg) {
      return kg.toLocaleString('en-GB', { maximumFractionDigits: 1 }) + ' kg'
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
    this.getAllData()
  }
}
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 0 0 1.5rem;
  padding: 0;
  list-style: none;
}

.stats li {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.25rem;
  border-left: 5px solid var(--moss);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.stat-value {
  font-family: 'Bricolage Grotesque', 'Instrument Sans', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
}

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

.status-pill {
  padding: 0.15rem 0.65rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  background: #e7e3d6;
}

.status-pill.completed {
  background: var(--accent);
}

.status-pill.in_progress {
  background: #cfe3d6;
}

.status-pill.planned {
  background: #f0dcb4;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chip {
  padding: 0.1rem 0.6rem;
  border-left: 4px solid var(--chip);
  border-radius: 6px;
  background: var(--paper);
  font-size: 0.85rem;
  white-space: nowrap;
}
</style>
