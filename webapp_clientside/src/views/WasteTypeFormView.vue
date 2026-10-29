<template>
  <div>
    <PageHeader
      :title="isNew ? 'New waste type' : 'Edit waste type'"
      :description="isNew ? 'Add a waste type to the database.' : form && form.label"
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <router-link :to="backTo" class="back-link">
        <i class="bi bi-arrow-left" aria-hidden="true"></i> Back
      </router-link>

      <EntityForm v-if="form" :cancel-to="backTo" @submit="submitForm">
        <div class="col-md-8">
          <label for="wt-label" class="form-label">Label</label>
          <input id="wt-label" v-model="form.label" type="text" class="form-control" maxlength="100" />
        </div>
        <div class="col-md-4">
          <label for="wt-category" class="form-label">Category</label>
          <select id="wt-category" v-model="form.category" class="form-select">
            <option value="" disabled>Choose…</option>
            <option v-for="(icon, category) in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="wt-price" class="form-label">Price per ton (€)</label>
          <input id="wt-price" v-model.number="form.price_per_ton" type="number" min="0" step="0.01" class="form-control" />
        </div>
        <div class="col-md-4">
          <label for="wt-color" class="form-label">Colour code</label>
          <input id="wt-color" v-model="form.color_code" type="color" class="form-control form-control-color w-100" />
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <div class="form-check form-switch mb-2">
            <input id="wt-recyclable" v-model="form.is_recyclable" type="checkbox" class="form-check-input" role="switch" />
            <label for="wt-recyclable" class="form-check-label">Recyclable</label>
          </div>
        </div>
      </EntityForm>

      <p v-else class="text-muted">There is no waste type with the ID {{ $route.params.id }}.</p>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import EntityForm from '@/components/EntityForm.vue'
import wasteCategories from '@/enums/wasteCategories'
// Fake JSON data: same field names as the waste_type table
import wasteTypesData from '../../../data/waste_types.json'

export default {
  name: 'WasteTypeFormView',
  components: { PageHeader, EntityForm },
  data() {
    return {
      section: sections.find((s) => s.name === 'waste-types'),
      categories: wasteCategories,
      form: null
    }
  },
  computed: {
    isNew() {
      return !this.$route.params.id
    },
    backTo() {
      return this.isNew ? '/waste-types' : `/waste-types/${this.$route.params.id}`
    }
  },
  methods: {
    getData() {
      if (this.isNew) {
        this.form = {
          label: '',
          category: '',
          is_recyclable: true,
          price_per_ton: 0,
          color_code: '#2f5d43'
        }
        return
      }
      // Later: replaced by a fetch() call to the server
      const id = Number(this.$route.params.id)
      const wasteType = wasteTypesData.find((w) => w.waste_type_id === id)
      // Copy, so the form never changes the loaded data
      this.form = wasteType ? { ...wasteType } : null
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
