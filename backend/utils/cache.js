// utils/cache.js
const NodeCache = require('node-cache');

// Default TTL: 6 seconds (6000 milliseconds)
const cache = new NodeCache({ stdTTL: 6, checkperiod: 6 });

module.exports = cache;
