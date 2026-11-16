// All the calls to the server, in one place.
// The URL comes from webapp_clientside/.env (VUE_APP_API_URL, see .env.example).
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:9000'

async function request(path, options = {}) {
  const response = await fetch(API_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!response.ok) {
    throw new Error(`Server error ${response.status} on ${path}`)
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

// Only treatmentCentersApi.getAll() and getById() exist on the server for now.
// The other pages still read the JSON files and will switch to these later.
export const treatmentCentersApi = crud('treatment-centers')
export const wasteTypesApi = crud('waste-types')
export const collectionPointsApi = crud('collection-points')
export const collectionsApi = crud('collections')
