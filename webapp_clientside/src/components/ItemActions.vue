<template>
  <div class="item-actions">
    <router-link
      v-if="!hideShow"
      :to="`${base}/${id}`"
      class="btn btn-sm btn-outline-secondary"
      :aria-label="'Show ' + name"
    >
      <i class="bi bi-eye" aria-hidden="true"></i> Show
    </router-link>
    <router-link
      :to="`${base}/${id}/edit`"
      class="btn btn-sm btn-outline-secondary"
      :aria-label="'Edit ' + name"
    >
      <i class="bi bi-pencil" aria-hidden="true"></i> Edit
    </router-link>
    <button
      type="button"
      class="btn btn-sm btn-outline-danger"
      :aria-label="'Delete ' + name"
      @click="deleteItem"
    >
      <i class="bi bi-trash3" aria-hidden="true"></i> Delete
    </button>
  </div>
</template>

<script>
// Show / Edit / Delete buttons, shared by every list page and datasheet.
export default {
  name: 'ItemActions',
  props: {
    // List path of the entity, e.g. '/waste-types'
    base: { type: String, required: true },
    id: { type: Number, required: true },
    // Used in the aria-labels
    name: { type: String, default: '' },
    hideShow: { type: Boolean, default: false }
  },
  methods: {
    deleteItem() {
      // Later: DELETE request to the server. For now nothing happens.
    }
  }
}
</script>
