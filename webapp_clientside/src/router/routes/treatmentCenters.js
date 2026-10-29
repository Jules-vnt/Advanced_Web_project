// Datasheet, new and edit pages of the treatment centers
export default [
  {
    path: '/treatment-centers/new',
    name: 'treatment-center-new',
    component: () => import('../../views/TreatmentCenterFormView.vue')
  },
  {
    path: '/treatment-centers/:id(\\d+)',
    name: 'treatment-center',
    component: () => import('../../views/TreatmentCenterView.vue')
  },
  {
    path: '/treatment-centers/:id(\\d+)/edit',
    name: 'treatment-center-edit',
    component: () => import('../../views/TreatmentCenterFormView.vue')
  }
]
