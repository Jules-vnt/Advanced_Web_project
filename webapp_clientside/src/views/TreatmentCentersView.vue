<template>
  <div>
    <PageHeader
      :title="section.label"
      :description="section.description"
      :image="section.image"
      :image-alt="section.imageAlt"
    />

    <div class="container pb-5">
      <p class="text-muted">This list is not built yet.</p>
    </div>
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'TreatmentCentersView',
  components: { PageHeader },
  data() {
    return {
      section: sections.find((s) => s.name === 'treatment-centers')
    }
  }
}
</script>
