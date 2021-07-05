import debug from 'debug'
import { SessionService } from '../interfaces/sessionService.interface'
import { UserSessionMetadata } from '../interfaces/userSessionMetadata.interface'
import clientConfigurationService from './clientConfiguration.service'
const redisClient = require('./redis-client')
const log: debug.IDebugger = debug('service:userSession')

class UserSessionService implements SessionService {
    async getAllUserSessions(userId: string) {
        const ok = await redisClient.smembersAsync(userId)
        return ok
    }

    async storeUserSession(userSession: UserSessionMetadata) {
        const appUrl = clientConfigurationService.readClientConfig(
            userSession.clientId
        )
        if (appUrl === '') {
            return { status: 400, message: 'Client ID not found' }
        }

        const userSessionKey = [
            userSession.userId,
            userSession.sessionId,
            userSession.clientId,
        ].join('::')
        const userSessionCallbackUrl = appUrl + '::' + userSession.state
        const response = await redisClient.setExAsync(
            userSessionKey,
            redisClient.defaultTTL,
            userSessionCallbackUrl
        )

        if (response === 'OK') {
            return { message: 'OK' }
        } else {
            throw new Error(`Unexpected response from redis store: ${response}`)
        }
    }
}

export default new UserSessionService()
