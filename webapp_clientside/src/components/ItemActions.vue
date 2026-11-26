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
      :disabled="deleting"
      @click="deleteItem"
    >
      <i class="bi bi-trash3" aria-hidden="true"></i> Delete
    </button>
    <p v-if="error" class="item-actions-error text-danger small mb-0" role="alert">{{ error }}</p>
  </div>
</template>

<script>
// Show / Edit / Delete buttons, shared by every list page and datasheet.
import { apiByBase } from '@/services/api'

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
  // 'deleted' is sent after a successful DELETE so the list can reload
  emits: ['deleted'],
  data() {
    return { deleting: false, error: null }
  },
  methods: {
    async deleteItem() {
      const label = this.name || 'this item'
      if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
        return
      }
      this.deleting = true
      this.error = null
      try {
        await apiByBase[this.base].remove(this.id)
        this.$emit('deleted', this.id)
        // On a datasheet the item no longer exists: go back to the list
        if (this.hideShow) {
          this.$router.push(this.base)
        }
      } catch (err) {
        // e.g. 409 "This treatment center still has collections..."
        this.error = err.message
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>

<style scoped>
.item-actions-error {
  flex-basis: 100%;
}
</style>
