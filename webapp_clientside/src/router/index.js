import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/waste-types',
    name: 'waste-types',
    component: () => import('../views/WasteTypesView.vue')
  },
  {
    path: '/collection-points',
    name: 'collection-points',
    component: () => import('../views/CollectionPointsView.vue')
  },
  {
    path: '/collections',
    name: 'collections',
    component: () => import('../views/CollectionsView.vue')
  },
  {
    path: '/treatment-centers',
    name: 'treatment-centers',
    component: () => import('../views/TreatmentCentersView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('../views/LogoutView.vue')
  }
]

// Datasheet / new / edit routes: one file per entity in ./routes,
// loaded automatically so each entity's routes can be added separately.
const entityRoutes = require.context('./routes', false, /\.js$/)
entityRoutes.keys().forEach((file) => {
  routes.push(...entityRoutes(file).default)
})

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
