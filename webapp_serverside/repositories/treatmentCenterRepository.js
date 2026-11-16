// Database access for the treatment_center table ("db repository" pattern)
const pool = require('../utils/db')

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

  // One center, or undefined if the id does not exist
  async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM treatment_center WHERE center_id = ?',
      [id]
    )
    return rows[0]
  }
}
