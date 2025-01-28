const Redis = require('ioredis');
const redis = new Redis({
  host: 'redis',  // replace with your Redis server host
  port: 6379,         // default Redis port
  db: 0,              // default Redis DB
});

module.exports = redis;
