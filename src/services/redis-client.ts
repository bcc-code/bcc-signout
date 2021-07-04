import debug from 'debug'
const redis = require('redis')
const { promisify } = require('util')

const debugLog: debug.IDebugger = debug('redis-client')
const defaultTTL: number = 31*24*60*60 //seconds in a 31-day month

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
client.on('connect', function () {
    debugLog(
        `Connected to redis instance ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    )

    /* if (process.env.NODE_ENV === 'development') {
        restoreTestData()
    } */
})

client.on('error', function (err: Error) {
    debugLog(`Trying to connect to redis instance ${process.env.REDIS_HOST}:${process.env.REDIS_PORT} failed`)
    debugLog(client.address)
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
    setExAsync: promisify(client.setex).bind(client),
    keysAsync: promisify(client.keys).bind(client),
    defaultTTL: defaultTTL
}
