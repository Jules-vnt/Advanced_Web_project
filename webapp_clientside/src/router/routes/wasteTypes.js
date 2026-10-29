// Datasheet, new and edit pages of the waste types
export default [
  {
    path: '/waste-types/new',
    name: 'waste-type-new',
    component: () => import('../../views/WasteTypeFormView.vue')
  },
  {
    path: '/waste-types/:id(\\d+)',
    name: 'waste-type',
    component: () => import('../../views/WasteTypeView.vue')
  },
  {
    path: '/waste-types/:id(\\d+)/edit',
    name: 'waste-type-edit',
    component: () => import('../../views/WasteTypeFormView.vue')
  }
]
