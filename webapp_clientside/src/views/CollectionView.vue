<template>
  <div>
    <PageHeader
      :title="collection ? 'Collection #' + collection.collection_id : 'Collection not found'"
      description="Datasheet of a collection round."
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <router-link to="/collections" class="back-link">
        <i class="bi bi-arrow-left" aria-hidden="true"></i> All collections
      </router-link>

      <div v-if="collection" class="sheet">
        <dl class="sheet-facts">
          <dt>Date</dt>
          <dd>{{ formatDate(collection.collection_date) }}</dd>
          <dt>Status</dt>
          <dd>
            <span :class="['status-pill', collection.status]">{{ statuses[collection.status] }}</span>
          </dd>
          <dt>Collection point</dt>
          <dd>
            <router-link :to="'/collection-points/' + collection.point_id">
              {{ pointName(collection.point_id) }}
            </router-link>
          </dd>
          <dt>Treatment center</dt>
          <dd>
            <router-link :to="'/treatment-centers/' + collection.center_id">
              {{ centerName(collection.center_id) }}
            </router-link>
          </dd>
          <dt>Driver</dt>
          <dd>{{ collection.driver_name }}</dd>
          <dt>Vehicle</dt>
          <dd>{{ collection.vehicle_plate }}</dd>
        </dl>

        <ItemActions
          base="/collections"
          :id="collection.collection_id"
          :name="'collection ' + collection.collection_id"
          hide-show
        />

        <section class="sheet-section">
          <h2>Waste collected</h2>
          <table v-if="lines.length" class="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Waste type</th>
                <th scope="col">Sorted</th>
                <th scope="col" class="text-end">Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="line in lines" :key="line.waste_type_id">
                <td>
                  <span class="dot" :style="{ background: wasteType(line.waste_type_id).color_code }"></span>
                  <router-link :to="'/waste-types/' + line.waste_type_id">
                    {{ wasteType(line.waste_type_id).label }}
                  </router-link>
                </td>
                <td>{{ line.is_sorted ? 'Yes' : 'No' }}</td>
                <td class="text-end">{{ formatKg(line.quantity_kg) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colspan="2">Total</th>
                <td class="text-end fw-semibold">{{ formatKg(totalKg) }}</td>
              </tr>
            </tfoot>
          </table>
          <p v-else class="text-muted mb-0">Nothing recorded yet.</p>
        </section>
      </div>

      <p v-else class="text-muted">There is no collection with the ID {{ $route.params.id }}.</p>
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
  name: 'CollectionView',
  components: { PageHeader, ItemActions },
  data() {
    return {
      section: sections.find((s) => s.name === 'collections'),
      collection: null,
      lines: [],
      statuses: collectionStatuses
    }
  },
  computed: {
    totalKg() {
      return this.lines.reduce((sum, l) => sum + l.quantity_kg, 0)
    }
  },
  methods: {
    getData() {
      // Later: replaced by fetch() calls to the server
      const id = Number(this.$route.params.id)
      this.collection = collectionsData.find((c) => c.collection_id === id) || null
      this.lines = wasteLinesData.filter((l) => l.collection_id === id)
    },
    wasteType(id) {
      return wasteTypesData.find((w) => w.waste_type_id === id) || { label: '—', color_code: '#999999' }
    },
    pointName(id) {
      const point = pointsData.find((p) => p.point_id === id)
      return point ? point.name : '—'
    },
    centerName(id) {
      const center = centersData.find((c) => c.center_id === id)
      return center ? center.name : '—'
    },
    formatKg(kg) {
      return kg.toLocaleString('en-GB', { maximumFractionDigits: 1 }) + ' kg'
    },
    formatDate(iso) {
      return new Date(iso).toLocaleDateString('en-GB', {
        weekday: 'long',
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
  border-left: 6px solid var(--moss);
}

.status-pill {
  padding: 0.15rem 0.65rem;
  border-radius: 999px;
  font-size: 0.85rem;
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

.dot {
  display: inline-block;
  width: 0.7rem;
  height: 0.7rem;
  margin-right: 0.4rem;
  border-radius: 50%;
}
</style>
