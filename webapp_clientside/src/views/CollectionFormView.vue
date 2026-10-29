<template>
  <div>
    <PageHeader
      :title="isNew ? 'New collection' : 'Edit collection #' + $route.params.id"
      :description="isNew ? 'Plan a new collection round.' : 'Change the details of this collection round.'"
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <router-link :to="backTo" class="back-link">
        <i class="bi bi-arrow-left" aria-hidden="true"></i> Back
      </router-link>

      <EntityForm v-if="form" :cancel-to="backTo" @submit="submitForm">
        <div class="col-md-4">
          <label for="col-date" class="form-label">Date</label>
          <input id="col-date" v-model="form.collection_date" type="date" class="form-control" />
        </div>
        <div class="col-md-4">
          <label for="col-status" class="form-label">Status</label>
          <select id="col-status" v-model="form.status" class="form-select">
            <option v-for="(label, status) in statuses" :key="status" :value="status">
              {{ label }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="col-plate" class="form-label">Vehicle plate</label>
          <input id="col-plate" v-model="form.vehicle_plate" type="text" class="form-control" maxlength="20" placeholder="AB-123-CD" />
        </div>
        <div class="col-md-6">
          <label for="col-point" class="form-label">Collection point</label>
          <select id="col-point" v-model="form.point_id" class="form-select">
            <option :value="null" disabled>Choose…</option>
            <option v-for="p in points" :key="p.point_id" :value="p.point_id">
              {{ p.name }} ({{ p.city }})
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="col-center" class="form-label">Treatment center</label>
          <select id="col-center" v-model="form.center_id" class="form-select">
            <option :value="null" disabled>Choose…</option>
            <option v-for="c in centers" :key="c.center_id" :value="c.center_id">
              {{ c.name }}
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="col-driver" class="form-label">Driver</label>
          <input id="col-driver" v-model="form.driver_name" type="text" class="form-control" maxlength="100" />
        </div>

        <!-- collection_waste rows of this collection -->
        <fieldset class="col-12">
          <legend class="form-label fs-6">Waste collected</legend>
          <div v-for="(line, i) in form.lines" :key="i" class="row g-2 align-items-center mb-2">
            <div class="col-md-5">
              <select v-model="line.waste_type_id" class="form-select" :aria-label="'Waste type of line ' + (i + 1)">
                <option :value="null" disabled>Waste type…</option>
                <option v-for="w in wasteTypes" :key="w.waste_type_id" :value="w.waste_type_id">
                  {{ w.label }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <div class="input-group">
                <input v-model.number="line.quantity_kg" type="number" min="0" step="0.1" class="form-control" :aria-label="'Quantity of line ' + (i + 1)" />
                <span class="input-group-text">kg</span>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-check">
                <input :id="'col-sorted-' + i" v-model="line.is_sorted" type="checkbox" class="form-check-input" />
                <label :for="'col-sorted-' + i" class="form-check-label">Sorted</label>
              </div>
            </div>
            <div class="col-md-2 text-md-end">
              <button type="button" class="btn btn-sm btn-outline-danger" @click="removeLine(i)">
                <i class="bi bi-x-lg" aria-hidden="true"></i> Remove
              </button>
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="addLine">
            <i class="bi bi-plus-lg" aria-hidden="true"></i> Add a waste line
          </button>
        </fieldset>
      </EntityForm>

      <p v-else class="text-muted">There is no collection with the ID {{ $route.params.id }}.</p>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import EntityForm from '@/components/EntityForm.vue'
import collectionStatuses from '@/enums/collectionStatuses'
// Fake JSON data: same field names as the collection, collection_waste,
// collection_point, treatment_center and waste_type tables
import collectionsData from '../../../data/collections.json'
import wasteLinesData from '../../../data/waste_collection.json'
import pointsData from '../../../data/collection_points.json'
import centersData from '../../../data/treatment_centers.json'
import wasteTypesData from '../../../data/waste_types.json'

export default {
  name: 'CollectionFormView',
  components: { PageHeader, EntityForm },
  data() {
    return {
      section: sections.find((s) => s.name === 'collections'),
      statuses: collectionStatuses,
      points: [],
      centers: [],
      wasteTypes: [],
      form: null
    }
  },
  computed: {
    isNew() {
      return !this.$route.params.id
    },
    backTo() {
      return this.isNew ? '/collections' : `/collections/${this.$route.params.id}`
    }
  },
  methods: {
    getData() {
      // Later: replaced by fetch() calls to the server
      this.points = pointsData
      this.centers = centersData
      this.wasteTypes = wasteTypesData

      if (this.isNew) {
        this.form = {
          collection_date: '',
          status: 'planned',
          point_id: null,
          center_id: null,
          vehicle_plate: '',
          driver_name: '',
          lines: []
        }
        return
      }
      const id = Number(this.$route.params.id)
      const collection = collectionsData.find((c) => c.collection_id === id)
      // Copies, so the form never changes the loaded data
      this.form = collection
        ? {
            ...collection,
            lines: wasteLinesData.filter((l) => l.collection_id === id).map((l) => ({ ...l }))
          }
        : null
    },
    addLine() {
      this.form.lines.push({ waste_type_id: null, quantity_kg: 0, is_sorted: false })
    },
    removeLine(index) {
      this.form.lines.splice(index, 1)
    },
    submitForm() {
      // Later: POST (new) or PUT (edit) request to the server. For now nothing happens.
    }
  },
  created() {
    this.getData()
  }
}
</script>
