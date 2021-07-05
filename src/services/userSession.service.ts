import { SessionService } from '../interfaces/sessionService.interface'
import { UserSessionMetadata } from '../interfaces/userSessionMetadata.interface'
import clientConfigurationService from './clientConfiguration.service'
const redisClient = require('./redis-client')

class UserSessionService implements SessionService {
    async getAllUserSessions(userId: string) {
        const ok = await redisClient.smembersAsync(userId)
        return ok
    }

    async storeUserSession(userSession: UserSessionMetadata) {
        const appUrl = clientConfigurationService.readClientConfig(userSession.clientId)
        if(appUrl === "") {
            throw new Error("Client configuration for this clientId has not been found.")
        }

        const userSessionKey = [userSession.userId, userSession.sessionId, userSession.clientId].join("::")
        const userSessionCallbackUrl = appUrl + "::" + userSession.state
        const response = await redisClient.setExAsync(userSessionKey, redisClient.defaultTTL, userSessionCallbackUrl)

        if(response === "OK") {
            return { message: "OK"}
        } else {
            throw new Error(`Unexpected response from redis instance: ${response}`)
        }      
    }
}

export default new UserSessionService()
