// Datasheet, new and edit pages of the collection points
export default [
  {
    path: '/collection-points/new',
    name: 'collection-point-new',
    component: () => import('../../views/CollectionPointFormView.vue')
  },
  {
    path: '/collection-points/:id(\\d+)',
    name: 'collection-point',
    component: () => import('../../views/CollectionPointView.vue')
  },
  {
    path: '/collection-points/:id(\\d+)/edit',
    name: 'collection-point-edit',
    component: () => import('../../views/CollectionPointFormView.vue')
  }
]
