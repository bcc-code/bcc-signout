import debug from 'debug'
const redis = require('redis')
const { promisify } = require('util')

const debugLog: debug.IDebugger = debug('service:redis-client')
const defaultTTL: number = 31 * 24 * 60 * 60 //seconds in a 31-day month

const client = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_HOST
)
client.on('connect', function () {
    debugLog(
        `Connected to redis instance ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    )
})

client.on('error', function (err: Error) {
    debugLog(
        `Trying to connect to redis instance ${process.env.REDIS_HOST}:${process.env.REDIS_PORT} failed`
    )
    debugLog(client.address)
    throw err
})

client.on('reconnecting', function (msg: string) {
    debugLog('Redis reconnecting:', msg)
})

module.exports = {
    ...client,
    mgetAsync: promisify(client.mget).bind(client),
    saddAsync: promisify(client.sadd).bind(client),
    smembersAsync: promisify(client.smembers).bind(client),
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client),
    setExAsync: promisify(client.setex).bind(client),
    keysAsync: promisify(client.keys).bind(client),
    delAsync: promisify(client.del).bind(client),
    defaultTTL: defaultTTL,
}
