// Database access for the treatment_center table ("db repository" pattern)
const pool = require('../utils/db')

// Columns the client is allowed to write
function values(c) {
  return [
    c.name,
    c.city,
    c.address || null,
    Number(c.capacity_tons) || 0,
    c.opening_date || null,
    c.is_active ? 1 : 0
  ]
}

module.exports = {
  // Every center, with its number of collection points and collections
  async getAll() {
    const [rows] = await pool.query(
      `SELECT tc.*,
              (SELECT COUNT(*) FROM collection_point cp WHERE cp.center_id = tc.center_id) AS point_count,
              (SELECT COUNT(*) FROM collection c WHERE c.center_id = tc.center_id) AS collection_count
         FROM treatment_center tc
        ORDER BY tc.center_id`
    )
    return rows
  },

  // One center (+ the same counts), or undefined if the id does not exist
  async getById(id) {
    const [rows] = await pool.query(
      `SELECT tc.*,
              (SELECT COUNT(*) FROM collection_point cp WHERE cp.center_id = tc.center_id) AS point_count,
              (SELECT COUNT(*) FROM collection c WHERE c.center_id = tc.center_id) AS collection_count
         FROM treatment_center tc
        WHERE tc.center_id = ?`,
      [id]
    )
    return rows[0]
  },

  // Returns the id of the new center
  async create(c) {
    const [result] = await pool.query(
      `INSERT INTO treatment_center (name, city, address, capacity_tons, opening_date, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      values(c)
    )
    return result.insertId
  },

  // Returns the number of updated rows (0 = id not found)
  async update(id, c) {
    const [result] = await pool.query(
      `UPDATE treatment_center
          SET name = ?, city = ?, address = ?, capacity_tons = ?, opening_date = ?, is_active = ?
        WHERE center_id = ?`,
      [...values(c), id]
    )
    return result.affectedRows
  },

  // Returns the number of deleted rows (0 = id not found).
  // Refused by MySQL (ER_ROW_IS_REFERENCED_2) while collections still use the center.
  async remove(id) {
    const [result] = await pool.query('DELETE FROM treatment_center WHERE center_id = ?', [id])
    return result.affectedRows
  }
}
