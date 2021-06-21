const redisClient = require('./redis-client')

class ClientService {
    async registerClient(clientId: string, callbackUrl: string) {
        const ok = redisClient.setAsync(clientId, callbackUrl)
        return ok
    }
}

export default new ClientService()
