// Datasheet, new and edit pages of the collections
export default [
  {
    path: '/collections/new',
    name: 'collection-new',
    component: () => import('../../views/CollectionFormView.vue')
  },
  {
    path: '/collections/:id(\\d+)',
    name: 'collection',
    component: () => import('../../views/CollectionView.vue')
  },
  {
    path: '/collections/:id(\\d+)/edit',
    name: 'collection-edit',
    component: () => import('../../views/CollectionFormView.vue')
  }
]
