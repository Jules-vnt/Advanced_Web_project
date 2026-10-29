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

      <EntityForm v-if="form" :cancel-to="backTo" @submit="submitForm">
        <div class="col-md-8">
          <label for="tc-name" class="form-label">Name</label>
          <input id="tc-name" v-model="form.name" type="text" class="form-control" maxlength="100" />
        </div>
        <div class="col-md-4">
          <label for="tc-city" class="form-label">City</label>
          <input id="tc-city" v-model="form.city" type="text" class="form-control" maxlength="100" />
        </div>
        <div class="col-12">
          <label for="tc-address" class="form-label">Address</label>
          <input id="tc-address" v-model="form.address" type="text" class="form-control" maxlength="255" />
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

      <p v-else class="text-muted">There is no treatment center with the ID {{ $route.params.id }}.</p>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import EntityForm from '@/components/EntityForm.vue'
// Fake JSON data: same field names as the treatment_center table
import centersData from '../../../data/treatment_centers.json'

export default {
  name: 'TreatmentCenterFormView',
  components: { PageHeader, EntityForm },
  data() {
    return {
      section: sections.find((s) => s.name === 'treatment-centers'),
      form: null
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
    getData() {
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
      // Later: replaced by a fetch() call to the server
      const id = Number(this.$route.params.id)
      const center = centersData.find((c) => c.center_id === id)
      // Copy, so the form never changes the loaded data
      this.form = center ? { ...center } : null
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
