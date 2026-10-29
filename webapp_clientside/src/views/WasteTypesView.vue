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
        <p class="text-muted mb-0">{{ wasteTypes.length }} waste types in the database.</p>
        <router-link to="/waste-types/new" class="btn-brand">
          <i class="bi bi-plus-lg" aria-hidden="true"></i> New waste type
        </router-link>
      </div>

      <ul class="bins">
        <li
          v-for="w in wasteTypes"
          :key="w.waste_type_id"
          class="bin"
          :style="{ '--bin': w.color_code }"
        >
          <!-- Coloured lid: the colour comes from the color_code column -->
          <div class="bin-lid">
            <i :class="['bi', icons[w.category] || 'bi-trash3']" aria-hidden="true"></i>
            <span class="bin-id">#{{ w.waste_type_id }}</span>
          </div>

          <div class="bin-body">
            <span class="bin-cat">{{ w.category }}</span>
            <h2 class="bin-title">{{ w.label }}</h2>

            <dl class="bin-facts">
              <dt>Price per ton</dt>
              <dd>{{ w.price_per_ton }} €</dd>
              <dt>Recyclable</dt>
              <dd>
                <span :class="['badge-rec', w.is_recyclable ? 'yes' : 'no']">
                  {{ w.is_recyclable ? 'Yes' : 'No' }}
                </span>
              </dd>
            </dl>

            <ItemActions
              base="/waste-types"
              :id="w.waste_type_id"
              :name="w.label"
              class="bin-actions"
            />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import ItemActions from '@/components/ItemActions.vue'
import wasteCategories from '@/enums/wasteCategories'
// Fake JSON data: same field names as the waste_type table in recycling.sql
import wasteTypesData from '../../../data/waste_types.json'

export default {
  name: 'WasteTypesView',
  components: { PageHeader, ItemActions },
  data() {
    return {
      section: sections.find((s) => s.name === 'waste-types'),
      wasteTypes: [],
      icons: wasteCategories
    }
  },
  methods: {
    getAllData() {
      // Later: replaced by a fetch() call to the server
      this.wasteTypes = wasteTypesData
    }
  },
  created() {
    this.getAllData()
  }
}
</script>

<style scoped>
.bins {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.bin {
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.bin-lid {
  position: relative;
  height: 90px;
  display: grid;
  place-items: center;
  background: var(--bin);
  color: #fff;
  font-size: 2.2rem;
}

.bin-id {
  position: absolute;
  right: 0.7rem;
  bottom: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.bin-body {
  padding: 1rem;
}

.bin-cat {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--bin);
}

.bin-title {
  margin: 0.25rem 0 0.75rem;
  font-size: 1.15rem;
}

.bin-facts {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.35rem 1rem;
  margin: 0;
  font-size: 0.9rem;
}

.bin-actions {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--line);
}

.bin-facts dt {
  font-weight: 400;
  color: var(--muted);
}

.bin-facts dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}

.badge-rec {
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
}

.badge-rec.yes {
  background: var(--accent);
  color: var(--ink);
}

.badge-rec.no {
  background: #e7e3d6;
  color: var(--muted);
}
</style>
