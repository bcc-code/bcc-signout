const redis = require('redis');
const {promisify} = require('util');

const client = redis.createClient({
    host: process.env.REDISHOST,
    port: process.env.REDISPORRT,
    //password: process.env.REDISPASSWORD
});

module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  keysAsync: promisify(client.keys).bind(client)
};