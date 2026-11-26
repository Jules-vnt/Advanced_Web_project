// Database access for the collection_point table ("db repository" pattern)
const pool = require('../utils/db')

// Columns the client is allowed to write
function values(p) {
  return [
    p.name,
    p.point_type,
    p.address || null,
    p.city,
    p.latitude === '' || p.latitude == null ? null : p.latitude,
    p.longitude === '' || p.longitude == null ? null : p.longitude,
    p.center_id || null
  ]
}

module.exports = {
  // Every point, with the name of its treatment center (LEFT JOIN: center can be NULL)
  async getAll() {
    const [rows] = await pool.query(
      `SELECT cp.*, tc.name AS center_name
         FROM collection_point cp
         LEFT JOIN treatment_center tc ON tc.center_id = cp.center_id
        ORDER BY cp.point_id`
    )
    return rows
  },

  // One point, or undefined if the id does not exist
  async getById(id) {
    const [rows] = await pool.query(
      `SELECT cp.*, tc.name AS center_name
         FROM collection_point cp
         LEFT JOIN treatment_center tc ON tc.center_id = cp.center_id
        WHERE cp.point_id = ?`,
      [id]
    )
    return rows[0]
  },

  // Points served by one treatment center
  async getByCenter(centerId) {
    const [rows] = await pool.query(
      'SELECT * FROM collection_point WHERE center_id = ? ORDER BY name',
      [centerId]
    )
    return rows
  },

  // Collections done at one point (read only: the collection table belongs to another member)
  async getCollections(pointId) {
    const [rows] = await pool.query(
      `SELECT collection_id, collection_date, driver_name, status
         FROM collection
        WHERE point_id = ?
        ORDER BY collection_date DESC`,
      [pointId]
    )
    return rows
  },

  // Returns the id of the new point
  async create(p) {
    const [result] = await pool.query(
      `INSERT INTO collection_point (name, point_type, address, city, latitude, longitude, center_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      values(p)
    )
    return result.insertId
  },

  // Returns the number of updated rows (0 = id not found)
  async update(id, p) {
    const [result] = await pool.query(
      `UPDATE collection_point
          SET name = ?, point_type = ?, address = ?, city = ?, latitude = ?, longitude = ?, center_id = ?
        WHERE point_id = ?`,
      [...values(p), id]
    )
    return result.affectedRows
  },

  // Returns the number of deleted rows (0 = id not found).
  // Its collections are deleted too (ON DELETE CASCADE).
  async remove(id) {
    const [result] = await pool.query('DELETE FROM collection_point WHERE point_id = ?', [id])
    return result.affectedRows
  }
}
