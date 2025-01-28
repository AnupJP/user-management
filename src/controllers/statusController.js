const pool = require('../config/db');
const redis = require('../config/redis')

exports.getStatus = async (req, res) => {
  try {
    // Check DB connection
    const [result] = await pool.query('SELECT 1');
    let dbStatus = 'Disconnected';
    if (result) {
      dbStatus = 'Connected';
    }

    // Check Redis connection
    let redisStatus = 'Disconnected';
    try {
      await redis.ping();
      redisStatus = 'Connected';
    } catch (error) {
      redisStatus = 'Error';
    }

    res.status(200).json({
      server: 'OK',
      database: dbStatus,
      redis: redisStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      server: 'OK',
      database: 'Error',
      redis: 'Error',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
