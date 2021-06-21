import debug from 'debug'
const redis = require('redis')
const { promisify } = require('util')

const debugLog: debug.IDebugger = debug('redis-client')
const client = redis.createClient({
    host: process.env.REDISHOST,
    port: process.env.REDISPORT,
    //password: process.env.REDISPASSWORD
})

client.on('connect', function () {
    debugLog(
        `Connected to redis instance ${process.env.REDISHOST}:${process.env.REDISPORT}`
    )

    if (process.env.NODE_ENV === 'development') {
        restoreTestData()
    }
})

client.on('error', function (err: Error) {
    console.error('Redis error:', err)
})

client.on('reconnecting', function (msg: string) {
    console.error('Redis reconnecting:', msg)
})

const restoreTestData = () => {
    client.flushall()
    var appsData = loadAppsData()
}

const loadAppsData = () => {
    var fs = require('fs');
    var appsData = JSON.parse(fs.readFileSync('./test/clientConfig.json', 'utf8')); 
    for (const app of appsData) {
        client.set(app.clientId, app.callbackUrl)
    }
}

module.exports = {
    ...client,
    mgetAsync: promisify(client.mget).bind(client),
    saddAsync: promisify(client.sadd).bind(client),
    smembersAsync: promisify(client.smembers).bind(client),
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client),
    keysAsync: promisify(client.keys).bind(client),
}
