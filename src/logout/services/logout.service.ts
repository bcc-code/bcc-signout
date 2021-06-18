import debug from 'debug'
const redisClient = require('../../redis-client')
const log: debug.IDebugger = debug('redis-client')

class LogoutService {
    async performFederatedLogOut(userId: string) {
        const userSessions = await redisClient.smembersAsync(userId)
        return `logout performed for user ${userId} on these aps: ${userSessions}`
    }
}

export default new LogoutService()
