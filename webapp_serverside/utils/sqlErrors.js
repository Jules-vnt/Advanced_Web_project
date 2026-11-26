// Turns MySQL errors into clear HTTP answers instead of a crash / generic 500.
function sendDbError(res, err, what) {
  switch (err.code) {
    // Row still used by another table (ON DELETE RESTRICT)
    case 'ER_ROW_IS_REFERENCED':
    case 'ER_ROW_IS_REFERENCED_2':
      return res.status(409).json({ error: `Cannot delete this ${what}: it is still used by other records` })
    // Foreign key points to a row that does not exist
    case 'ER_NO_REFERENCED_ROW':
    case 'ER_NO_REFERENCED_ROW_2':
      return res.status(400).json({ error: `Invalid ${what}: a linked record does not exist` })
    // Missing / wrong value (NOT NULL, ENUM, bad number or date...)
    case 'ER_BAD_NULL_ERROR':
    case 'ER_NO_DEFAULT_FOR_FIELD':
    case 'WARN_DATA_TRUNCATED':
    case 'ER_TRUNCATED_WRONG_VALUE':
    case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD':
    case 'ER_DATA_TOO_LONG':
    case 'ER_WARN_DATA_OUT_OF_RANGE':
      return res.status(400).json({ error: `Invalid ${what}: ${err.sqlMessage}` })
    default:
      console.error(err)
      return res.status(500).json({ error: `Database error on the ${what}` })
  }
}

module.exports = { sendDbError }
