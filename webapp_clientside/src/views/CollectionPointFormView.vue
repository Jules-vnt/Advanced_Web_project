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

      <div v-if="loading" class="text-center text-muted py-5">
        <div class="spinner-border" role="status" aria-hidden="true"></div>
      </div>

      <div v-if="error" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle" aria-hidden="true"></i> {{ error }}
      </div>

      <EntityForm v-if="form" :cancel-to="backTo" @submit="submitForm">
        <div class="col-md-8">
          <label for="cp-name" class="form-label">Name</label>
          <input id="cp-name" v-model="form.name" type="text" class="form-control" maxlength="100" required />
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
          <input id="cp-address" v-model="form.address" type="text" class="form-control" maxlength="150" />
        </div>
        <div class="col-md-4">
          <label for="cp-city" class="form-label">City</label>
          <input id="cp-city" v-model="form.city" type="text" class="form-control" maxlength="80" required />
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
            <option :value="null">None</option>
            <option v-for="c in centers" :key="c.center_id" :value="c.center_id">
              {{ c.name }}
            </option>
          </select>
        </div>
      </EntityForm>

      <p v-else-if="!loading && !error" class="text-muted">There is no collection point with the ID {{ $route.params.id }}.</p>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import EntityForm from '@/components/EntityForm.vue'
import pointTypes from '@/enums/pointTypes'
// New: POST /api/collection-points - Edit: GET then PUT /api/collection-points/:id
// The center list comes from GET /api/treatment-centers
import { collectionPointsApi, treatmentCentersApi } from '@/services/api'

export default {
  name: 'CollectionPointFormView',
  components: { PageHeader, EntityForm },
  data() {
    return {
      section: sections.find((s) => s.name === 'collection-points'),
      types: pointTypes,
      centers: [],
      form: null,
      loading: false,
      error: null
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
    async getData() {
      this.loading = true
      try {
        this.centers = await treatmentCentersApi.getAll()

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
        const point = await collectionPointsApi.getById(this.$route.params.id)
        // Only the editable columns (not center_name)
        this.form = {
          name: point.name,
          point_type: point.point_type,
          address: point.address,
          city: point.city,
          latitude: point.latitude,
          longitude: point.longitude,
          center_id: point.center_id
        }
      } catch (err) {
        if (err.status !== 404) {
          this.error = err.message
        }
        this.form = null
      } finally {
        this.loading = false
      }
    },
    async submitForm() {
      this.error = null
      // An emptied number input gives '' : send null instead
      const item = {
        ...this.form,
        latitude: this.form.latitude === '' ? null : this.form.latitude,
        longitude: this.form.longitude === '' ? null : this.form.longitude
      }
      try {
        const saved = this.isNew
          ? await collectionPointsApi.create(item)
          : await collectionPointsApi.update(this.$route.params.id, item)
        this.$router.push(`/collection-points/${saved.point_id}`)
      } catch (err) {
        // e.g. 400 "The latitude must be between -90 and 90"
        this.error = err.message
      }
    }
  },
  created() {
    this.getData()
  }
}
</script>
