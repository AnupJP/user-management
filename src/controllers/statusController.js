const pool = require('../config/db');

exports.getStatus = async (req, res) => {
  try {
    // Check DB connection
    const [result] = await pool.query('SELECT 1');
    if (result) {
      res.status(200).json({
        server: 'OK',
        database: 'Connected',
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(500).json({
        server: 'OK',
        database: 'Disconnected',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(500).json({
      server: 'OK',
      database: 'Error',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
