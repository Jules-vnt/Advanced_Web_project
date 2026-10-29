<template>
  <div>
    <PageHeader
      :title="wasteType ? wasteType.label : 'Waste type not found'"
      description="Datasheet of a waste type."
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <router-link to="/waste-types" class="back-link">
        <i class="bi bi-arrow-left" aria-hidden="true"></i> All waste types
      </router-link>

      <div v-if="wasteType" class="sheet" :style="{ '--bin': wasteType.color_code }">
        <div class="sheet-band">
          <i :class="['bi', icons[wasteType.category] || 'bi-trash3']" aria-hidden="true"></i>
          <span>{{ wasteType.category }}</span>
        </div>

        <dl class="sheet-facts">
          <dt>ID</dt>
          <dd>#{{ wasteType.waste_type_id }}</dd>
          <dt>Label</dt>
          <dd>{{ wasteType.label }}</dd>
          <dt>Category</dt>
          <dd class="text-capitalize">{{ wasteType.category }}</dd>
          <dt>Recyclable</dt>
          <dd>{{ wasteType.is_recyclable ? 'Yes' : 'No' }}</dd>
          <dt>Price per ton</dt>
          <dd>{{ wasteType.price_per_ton }} €</dd>
          <dt>Colour code</dt>
          <dd>
            <span class="swatch" aria-hidden="true"></span>
            {{ wasteType.color_code }}
          </dd>
        </dl>

        <ItemActions
          base="/waste-types"
          :id="wasteType.waste_type_id"
          :name="wasteType.label"
          hide-show
        />

        <section class="sheet-section">
          <h2>Collected so far</h2>
          <p class="mb-0">
            {{ formatKg(totalKg) }} in {{ lines.length }} collection rounds
            <span class="text-muted">({{ formatKg(sortedKg) }} sorted)</span>
          </p>
        </section>
      </div>

      <p v-else class="text-muted">There is no waste type with the ID {{ $route.params.id }}.</p>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import ItemActions from '@/components/ItemActions.vue'
import wasteCategories from '@/enums/wasteCategories'
// Fake JSON data: same field names as the waste_type and collection_waste tables
import wasteTypesData from '../../../data/waste_types.json'
import wasteLinesData from '../../../data/waste_collection.json'

export default {
  name: 'WasteTypeView',
  components: { PageHeader, ItemActions },
  data() {
    return {
      section: sections.find((s) => s.name === 'waste-types'),
      wasteType: null,
      lines: [],
      icons: wasteCategories
    }
  },
  computed: {
    totalKg() {
      return this.lines.reduce((sum, l) => sum + l.quantity_kg, 0)
    },
    sortedKg() {
      return this.lines.filter((l) => l.is_sorted).reduce((sum, l) => sum + l.quantity_kg, 0)
    }
  },
  methods: {
    getData() {
      // Later: replaced by a fetch() call to the server
      const id = Number(this.$route.params.id)
      this.wasteType = wasteTypesData.find((w) => w.waste_type_id === id) || null
      this.lines = wasteLinesData.filter((l) => l.waste_type_id === id)
    },
    formatKg(kg) {
      return kg.toLocaleString('en-GB', { maximumFractionDigits: 1 }) + ' kg'
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>
.sheet {
  border-top: 6px solid var(--bin);
}

.sheet-band {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--bin);
}

.sheet-band .bi {
  font-size: 1.8rem;
}

.swatch {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.3rem;
  border-radius: 4px;
  background: var(--bin);
  vertical-align: -0.15rem;
}
</style>
