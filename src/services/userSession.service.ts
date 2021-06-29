import { SessionService } from '../interfaces/sessionService.interface'
const redisClient = require('./redis-client')

class UserSessionService implements SessionService {
    async getAllUserSessions(userId: string) {
        const ok = await redisClient.smembersAsync(userId)
        return ok
    }

    async storeUserSession(userId: string, appId: string) {
        const response = await redisClient.saddAsync(userId, appId)
        if(response === 1) {
            return { message: "OK", userId: userId, appId: appId }
        } else if(response === 0) {
            return { message: "Refreshed", userId: userId, appId: appId }
        } else {
            throw new Error(`Unexpected response from redis instance: ${response}`)
        }
        
    }
}

export default new UserSessionService()
