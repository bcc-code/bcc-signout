import debug from 'debug'
const redisClient = require('../../redis-client');
const log: debug.IDebugger = debug('redis-client');

class LogoutService {
    async performFederatedLogOut(userId: string) {
        return `logout performed for user ${userId}`
    }
}

export default new LogoutService()