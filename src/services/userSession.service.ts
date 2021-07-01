import { SessionService } from '../interfaces/sessionService.interface'
import { UserSessionMetadata } from '../interfaces/userSessionMetadata'
const redisClient = require('./redis-client')

class UserSessionService implements SessionService {
    async getAllUserSessions(userId: string) {
        const ok = await redisClient.smembersAsync(userId)
        return ok
    }

    async storeUserSession(userSession: UserSessionMetadata) {
        const response = await redisClient.saddAsync(userSession.userId, userSession.appId)
        if(response === 1) {
            return { message: "OK", userId: userSession.userId, appId: userSession.appId }
        } else if(response === 0) {
            return { message: "Refreshed", userId: userSession.userId, appId: userSession.appId }
        } else {
            throw new Error(`Unexpected response from redis instance: ${response}`)
        }
        
    }
}

export default new UserSessionService()
