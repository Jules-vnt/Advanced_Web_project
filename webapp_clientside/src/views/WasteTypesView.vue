<template>
  <div>
    <PageHeader
      :title="section.label"
      :description="section.description"
      :icon="section.icon"
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <section class="container py-5">
      <!-- Toolbar: filters + sort -->
      <div class="toolbar rise" style="--i: 1">
        <div class="filters" role="group" aria-label="Filter by category">
          <button
            type="button"
            :class="['filter', { active: category === 'all' }]"
            @click="category = 'all'"
          >
            All <span class="count tabular">{{ wasteTypes.length }}</span>
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            :class="['filter', { active: category === cat }]"
            @click="category = cat"
          >
            <i :class="['bi', icons[cat]]" aria-hidden="true"></i> {{ cat }}
          </button>
        </div>

        <div class="options">
          <label class="switch">
            <input type="checkbox" v-model="recyclableOnly" />
            <span>Recyclable only</span>
          </label>
          <select v-model="sortBy" class="sort" aria-label="Sort waste types">
            <option value="id">Sort: ID</option>
            <option value="label">Sort: name</option>
            <option value="price">Sort: price per ton</option>
          </select>
        </div>
      </div>

      <p class="result text-muted tabular">
        {{ filteredTypes.length }} waste type{{ filteredTypes.length > 1 ? 's' : '' }} shown
      </p>

      <!-- The list: one "bin" card per waste type -->
      <ul class="bins">
        <li
          v-for="(w, index) in filteredTypes"
          :key="w.waste_type_id"
          class="bin rise"
          :style="{ '--bin': w.color_code, '--i': index + 2 }"
        >
          <div class="bin-lid">
            <span class="bin-id tabular">#{{ w.waste_type_id }}</span>
            <i :class="['bi', icons[w.category], 'bin-icon']" aria-hidden="true"></i>
          </div>

          <div class="bin-body">
            <span class="bin-cat">{{ w.category }}</span>
            <h3 class="bin-title">{{ w.label }}</h3>

            <dl class="bin-facts">
              <div>
                <dt>Price per ton</dt>
                <dd class="tabular">{{ formatPrice(w.price_per_ton) }}</dd>
              </div>
              <div>
                <dt>Recyclable</dt>
                <dd>
                  <span :class="['badge-rec', w.is_recyclable ? 'yes' : 'no']">
                    <i :class="['bi', w.is_recyclable ? 'bi-check-lg' : 'bi-x-lg']" aria-hidden="true"></i>
                    {{ w.is_recyclable ? 'Yes' : 'No' }}
                  </span>
                </dd>
              </div>
            </dl>

            <!-- Price compared to the most valuable waste type -->
            <div class="meter" :title="`${Math.round(pricePercent(w))}% of the highest price`">
              <span :style="{ width: pricePercent(w) + '%' }"></span>
            </div>
          </div>
        </li>
      </ul>

      <div v-if="filteredTypes.length === 0" class="empty">
        <i class="bi bi-search" aria-hidden="true"></i>
        <p>No waste type matches these filters.</p>
        <button type="button" class="btn-ghost" @click="resetFilters">Reset filters</button>
      </div>
    </section>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
// Fake JSON data: same field names as the waste_type table in recycling.sql
import wasteTypesData from '../../../data/waste_types.json'

export default {
  name: 'WasteTypesView',
  components: { PageHeader },
  data() {
    return {
      section: sections.find((s) => s.name === 'waste-types'),
      wasteTypes: [],
      category: 'all',
      recyclableOnly: false,
      sortBy: 'id',
      icons: {
        plastic: 'bi-cup-straw',
        glass: 'bi-cup',
        paper: 'bi-newspaper',
        cardboard: 'bi-box-seam',
        metal: 'bi-nut',
        organic: 'bi-flower1',
        electronic: 'bi-plug',
        textile: 'bi-bag',
        hazardous: 'bi-exclamation-triangle',
        other: 'bi-trash3'
      }
    }
  },
  computed: {
    categories() {
      return [...new Set(this.wasteTypes.map((w) => w.category))]
    },
    maxPrice() {
      return Math.max(...this.wasteTypes.map((w) => w.price_per_ton))
    },
    filteredTypes() {
      const list = this.wasteTypes.filter(
        (w) =>
          (this.category === 'all' || w.category === this.category) &&
          (!this.recyclableOnly || w.is_recyclable)
      )
      if (this.sortBy === 'label') return list.sort((a, b) => a.label.localeCompare(b.label))
      if (this.sortBy === 'price') return list.sort((a, b) => b.price_per_ton - a.price_per_ton)
      return list.sort((a, b) => a.waste_type_id - b.waste_type_id)
    }
  },
  methods: {
    getAllData() {
      // Later: this.wasteTypes = (await fetch('http://localhost:9000/api/waste-types')).json()
      this.wasteTypes = wasteTypesData
    },
    formatPrice(value) {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
    },
    pricePercent(w) {
      return (w.price_per_ton / this.maxPrice) * 100
    },
    resetFilters() {
      this.category = 'all'
      this.recyclableOnly = false
    }
  },
  created() {
    this.getAllData()
  }
}
</script>

<style scoped>
/* Toolbar */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.filter {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: capitalize;
  transition: background-color 0.2s var(--ease), color 0.2s var(--ease);
}

.filter:hover {
  background: var(--paper-2);
}

.filter.active {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--accent);
}

.count {
  padding: 0 0.45rem;
  border-radius: 999px;
  background: var(--accent);
  color: var(--ink);
  font-size: 0.75rem;
  font-weight: 700;
}

.options {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.switch {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.switch input {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: var(--leaf);
}

.sort {
  padding: 0.45rem 0.8rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--paper);
  color: var(--ink);
  font-size: 0.9rem;
}

.result {
  margin: 1.25rem 0 1rem;
  font-size: 0.9rem;
}

/* Bin cards */
.bins {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.bin {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease);
}

.bin:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

/* The coloured lid uses the colour stored in the database (color_code) */
.bin-lid {
  position: relative;
  height: 110px;
  display: grid;
  place-items: center;
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 2px, transparent 2px 18px),
    var(--bin);
  color: #fff;
}

.bin-lid::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 12px;
  width: 54px;
  height: 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.22);
  transform: translateX(-50%);
}

.bin-icon {
  font-size: 2.6rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
  transition: transform 0.4s var(--ease);
}

.bin:hover .bin-icon {
  transform: scale(1.12) rotate(-6deg);
}

.bin-id {
  position: absolute;
  right: 0.8rem;
  bottom: 0.6rem;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.8;
}

.bin-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.1rem 1.2rem 1.25rem;
}

.bin-cat {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--bin);
}

.bin-title {
  margin: 0.3rem 0 1rem;
  font-size: 1.25rem;
}

.bin-facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin: auto 0 1rem;
}

.bin-facts dt {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--muted);
}

.bin-facts dd {
  margin: 0.15rem 0 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
}

.badge-rec {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.85rem;
}

.badge-rec.yes {
  background: var(--accent);
  color: var(--ink);
}

.badge-rec.no {
  background: var(--paper-2);
  color: var(--muted);
}

.meter {
  height: 6px;
  border-radius: 6px;
  background: var(--paper-2);
  overflow: hidden;
}

.meter span {
  display: block;
  height: 100%;
  border-radius: 6px;
  background: var(--bin);
  transition: width 0.6s var(--ease);
}

/* Empty state */
.empty {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
  color: var(--muted);
  text-align: center;
}

.empty .bi {
  font-size: 2rem;
}

@media (max-width: 575.98px) {
  .options {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
