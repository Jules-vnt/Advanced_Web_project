<template>
  <div>
    <PageHeader
      :title="isNew ? 'New collection point' : 'Edit collection point'"
      :description="isNew ? 'Add a bin or drop-off location.' : form && form.name"
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <router-link :to="backTo" class="back-link">
        <i class="bi bi-arrow-left" aria-hidden="true"></i> Back
      </router-link>

      <EntityForm v-if="form" :cancel-to="backTo" @submit="submitForm">
        <div class="col-md-8">
          <label for="cp-name" class="form-label">Name</label>
          <input id="cp-name" v-model="form.name" type="text" class="form-control" maxlength="100" />
        </div>
        <div class="col-md-4">
          <label for="cp-type" class="form-label">Type</label>
          <select id="cp-type" v-model="form.point_type" class="form-select">
            <option v-for="(t, type) in types" :key="type" :value="type">
              {{ t.label }}
            </option>
          </select>
        </div>
        <div class="col-md-8">
          <label for="cp-address" class="form-label">Address</label>
          <input id="cp-address" v-model="form.address" type="text" class="form-control" maxlength="255" />
        </div>
        <div class="col-md-4">
          <label for="cp-city" class="form-label">City</label>
          <input id="cp-city" v-model="form.city" type="text" class="form-control" maxlength="100" />
        </div>
        <div class="col-md-4">
          <label for="cp-lat" class="form-label">Latitude</label>
          <input id="cp-lat" v-model.number="form.latitude" type="number" step="0.000001" min="-90" max="90" class="form-control" />
        </div>
        <div class="col-md-4">
          <label for="cp-lon" class="form-label">Longitude</label>
          <input id="cp-lon" v-model.number="form.longitude" type="number" step="0.000001" min="-180" max="180" class="form-control" />
        </div>
        <div class="col-md-4">
          <label for="cp-center" class="form-label">Treatment center</label>
          <select id="cp-center" v-model="form.center_id" class="form-select">
            <option :value="null" disabled>Choose…</option>
            <option v-for="c in centers" :key="c.center_id" :value="c.center_id">
              {{ c.name }}
            </option>
          </select>
        </div>
      </EntityForm>

      <p v-else class="text-muted">There is no collection point with the ID {{ $route.params.id }}.</p>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import EntityForm from '@/components/EntityForm.vue'
import pointTypes from '@/enums/pointTypes'
// Fake JSON data: same field names as the collection_point and treatment_center tables
import pointsData from '../../../data/collection_points.json'
import centersData from '../../../data/treatment_centers.json'

export default {
  name: 'CollectionPointFormView',
  components: { PageHeader, EntityForm },
  data() {
    return {
      section: sections.find((s) => s.name === 'collection-points'),
      types: pointTypes,
      centers: [],
      form: null
    }
  },
  computed: {
    isNew() {
      return !this.$route.params.id
    },
    backTo() {
      return this.isNew ? '/collection-points' : `/collection-points/${this.$route.params.id}`
    }
  },
  methods: {
    getData() {
      // Later: replaced by fetch() calls to the server
      this.centers = centersData

      if (this.isNew) {
        this.form = {
          name: '',
          point_type: 'street_bin',
          address: '',
          city: '',
          latitude: null,
          longitude: null,
          center_id: null
        }
        return
      }
      const id = Number(this.$route.params.id)
      const point = pointsData.find((p) => p.point_id === id)
      // Copy, so the form never changes the loaded data
      this.form = point ? { ...point } : null
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
