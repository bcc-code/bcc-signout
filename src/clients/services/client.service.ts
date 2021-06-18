const redisClient = require('../../redis-client')

class ClientService {
    async registerClient(clientId: string, callbackURL: string) {
        const ok = redisClient.setAsync(clientId, callbackURL)
        return ok
    }
}
