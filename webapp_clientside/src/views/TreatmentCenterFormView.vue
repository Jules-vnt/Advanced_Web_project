<template>
  <div>
    <PageHeader
      :title="isNew ? 'New treatment center' : 'Edit treatment center'"
      :description="isNew ? 'Add a sorting or processing site.' : form && form.name"
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
          <label for="tc-name" class="form-label">Name</label>
          <input id="tc-name" v-model="form.name" type="text" class="form-control" maxlength="100" required />
        </div>
        <div class="col-md-4">
          <label for="tc-city" class="form-label">City</label>
          <input id="tc-city" v-model="form.city" type="text" class="form-control" maxlength="100" required />
        </div>
        <div class="col-12">
          <label for="tc-address" class="form-label">Address</label>
          <input id="tc-address" v-model="form.address" type="text" class="form-control" maxlength="150" />
        </div>
        <div class="col-md-4">
          <label for="tc-capacity" class="form-label">Capacity (tons)</label>
          <input id="tc-capacity" v-model.number="form.capacity_tons" type="number" min="0" step="0.01" class="form-control" />
        </div>
        <div class="col-md-4">
          <label for="tc-opening" class="form-label">Opening date</label>
          <input id="tc-opening" v-model="form.opening_date" type="date" class="form-control" />
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <div class="form-check form-switch mb-2">
            <input id="tc-active" v-model="form.is_active" type="checkbox" class="form-check-input" role="switch" />
            <label for="tc-active" class="form-check-label">Active</label>
          </div>
        </div>
      </EntityForm>

      <p v-else-if="!loading && !error" class="text-muted">There is no treatment center with the ID {{ $route.params.id }}.</p>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import EntityForm from '@/components/EntityForm.vue'
// New: POST /api/treatment-centers - Edit: GET then PUT /api/treatment-centers/:id
import { treatmentCentersApi } from '@/services/api'

export default {
  name: 'TreatmentCenterFormView',
  components: { PageHeader, EntityForm },
  data() {
    return {
      section: sections.find((s) => s.name === 'treatment-centers'),
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
      return this.isNew ? '/treatment-centers' : `/treatment-centers/${this.$route.params.id}`
    }
  },
  methods: {
    async getData() {
      if (this.isNew) {
        this.form = {
          name: '',
          city: '',
          address: '',
          capacity_tons: 0,
          opening_date: '',
          is_active: true
        }
        return
      }
      this.loading = true
      try {
        const center = await treatmentCentersApi.getById(this.$route.params.id)
        // Only the editable columns (not the counts)
        this.form = {
          name: center.name,
          city: center.city,
          address: center.address,
          capacity_tons: center.capacity_tons,
          opening_date: center.opening_date,
          is_active: !!center.is_active
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
      try {
        const saved = this.isNew
          ? await treatmentCentersApi.create(this.form)
          : await treatmentCentersApi.update(this.$route.params.id, this.form)
        this.$router.push(`/treatment-centers/${saved.center_id}`)
      } catch (err) {
        // e.g. 400 "The name is required"
        this.error = err.message
      }
    }
  },
  created() {
    this.getData()
  }
}
</script>
