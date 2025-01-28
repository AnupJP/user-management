const Redis = require('ioredis');
const redis = new Redis({
  host: 'redis',
  port: 6379,
  db: 0,
});

module.exports = redis;
