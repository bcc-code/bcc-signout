const redis = require('redis')
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
})

client.on('error', function (err: Error) {
    console.error('Redis error:', err)
})

client.on('reconnecting', function (msg: string) {
    console.log('Redis reconnecting:', msg)
})

const flushData = function () {
    client.flushall(function (err: Error, res: any) {
        if (err) {
            console.error(err)
        } else {
            console.log(res)
        }
    })
}

const restoreTestData = async function () {
    client.flushall()
    var appsData = loadAppsData()
    for (const app of appsData) {
        client.set(app.clientId, app.callbackUrl)
    }
}

const loadAppsData = (): any[] => {
    var fs = require('fs')
    var appsData = JSON.parse(
        fs.readFileSync('./data/clientConfig.json', 'utf8')
    )
    return appsData
}

module.exports = {
    client,
    flushData,
    restoreTestData,
}
