// All the calls to the server, in one place.
// The URL comes from webapp_clientside/.env (VUE_APP_API_URL, see .env.example).
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:9000'

async function request(path, options = {}) {
  const response = await fetch(API_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!response.ok) {
    // The server answers { error: '...' } (e.g. 409 when a delete is refused by a foreign key)
    let message = `Server error ${response.status} on ${path}`
    try {
      const body = await response.json()
      if (body && body.error) message = body.error
    } catch (e) {
      // No JSON body: keep the generic message
    }
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  // DELETE may answer with no body
  if (response.status === 204) {
    return null
  }
  return response.json()
}

// The same five calls for every entity
function crud(resource) {
  const base = '/api/' + resource
  return {
    getAll: () => request(base),
    getById: (id) => request(`${base}/${id}`),
    create: (item) => request(base, { method: 'POST', body: JSON.stringify(item) }),
    update: (id, item) => request(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
    remove: (id) => request(`${base}/${id}`, { method: 'DELETE' })
  }
}

export const treatmentCentersApi = {
  ...crud('treatment-centers'),
  // Collection points served by one center
  getPoints: (id) => request(`/api/treatment-centers/${id}/collection-points`)
}
export const collectionPointsApi = {
  ...crud('collection-points'),
  // Collections done at one point
  getCollections: (id) => request(`/api/collection-points/${id}/collections`)
}
export const wasteTypesApi = crud('waste-types')
export const collectionsApi = crud('collections')

// Used by ItemActions: list path of a page ('/treatment-centers') -> its API
export const apiByBase = {
  '/treatment-centers': treatmentCentersApi,
  '/collection-points': collectionPointsApi,
  '/waste-types': wasteTypesApi,
  '/collections': collectionsApi
}
