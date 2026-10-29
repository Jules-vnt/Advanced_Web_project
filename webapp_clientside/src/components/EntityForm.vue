<template>
  <form class="entity-form" @submit.prevent="$emit('submit')">
    <div class="row g-3">
      <slot />
    </div>

    <div class="entity-form-buttons">
      <button type="submit" class="btn-brand border-0">
        <i class="bi bi-check-lg" aria-hidden="true"></i> Submit
      </button>
      <router-link :to="cancelTo" class="btn btn-link">Cancel</router-link>
    </div>
  </form>
</template>

<script>
// Same form layout for every entity: the fields go in the slot.
export default {
  name: 'EntityForm',
  props: {
    cancelTo: { type: String, required: true }
  },
  emits: ['submit']
}
</script>
