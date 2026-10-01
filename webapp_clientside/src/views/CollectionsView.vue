<template>
  <div>
    <PageHeader
      :title="section.label"
      :description="section.description"
      :icon="section.icon"
      :image="section.image"
      :image-alt="section.imageAlt"
    />
    <ComingSoon title="Collection rounds are on their way" :icon="section.icon" />
  </div>
</template>

<script>
import sections from '@/sections'
import PageHeader from '@/components/PageHeader.vue'
import ComingSoon from '@/components/ComingSoon.vue'

export default {
  name: 'CollectionsView',
  components: { PageHeader, ComingSoon },
  data() {
    return {
      section: sections.find((s) => s.name === 'collections')
    }
  }
}
</script>
