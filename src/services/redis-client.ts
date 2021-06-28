import debug from 'debug'
const redis = require('redis')
const { promisify } = require('util')

const debugLog: debug.IDebugger = debug('redis-client')
const client = redis.createClient({
    host: process.env.REDISHOST,
    port: process.env.REDISPORT,
})

client.on('connect', function () {
    debugLog(
        `Connected to redis instance ${process.env.REDISHOST}:${process.env.REDISPORT}`
    )

    /* if (process.env.NODE_ENV === 'development') {
        restoreTestData()
    } */
})

client.on('error', function (err: Error) {
    throw(err)
})

client.on('reconnecting', function (msg: string) {
    debugLog('Redis reconnecting:', msg)
})

const restoreTestData = () => {
    client.flushall()
    var appsData = loadAppsData()
    for (const app of appsData) {
        client.set(app.clientId, app.callbackUrl)
    }
}

const loadAppsData = (): any[] => {
    var fs = require('fs');
    var appsData = JSON.parse(fs.readFileSync('./test/data/clientConfig.json', 'utf8')); 
    return appsData
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
