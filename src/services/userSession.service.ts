import debug from 'debug'
import { SessionService } from '../interfaces/sessionService.interface'
import { UserSessionMetadata } from '../interfaces/userSessionMetadata.interface'
import clientConfigurationService from './clientConfiguration.service'
const redisClient = require('./redis-client')
const log: debug.IDebugger = debug('service:userSession')

class UserSessionService implements SessionService {
    async storeUserSession(userSession: UserSessionMetadata) {
        const appUrls = clientConfigurationService.readClientConfig(
            userSession.clientId
        )
        if (appUrls[0] === '') {
            return { status: 400, message: 'Client ID not found' }
        }

        const { userSessionKey, userSessionCallbackUrls } =
            this.createUserSessionStorageData(userSession, appUrls)
        const response = await redisClient.saddAsync(
            userSessionKey,
            userSessionCallbackUrls
        )

        const ttl = await redisClient.expireAsync(
            userSessionKey,
            redisClient.defaultTTL
        )

        return { message: 'OK' }
    }

    private createUserSessionStorageData(
        userSession: UserSessionMetadata,
        appUrls: [string, string[]]
    ): { userSessionKey: string; userSessionCallbackUrls: string[] } {
        let userSessionCallbackUrls: string[] = []
        const userSessionKey = [
            userSession.userId,
            userSession.sessionId,
            userSession.clientId,
        ].join('::')
        appUrls[1].forEach((url) => {
            userSessionCallbackUrls.push(
                [url, appUrls[0], userSession.state].join('::')
            )
        })
        return { userSessionKey, userSessionCallbackUrls }
    }
}

export default new UserSessionService()
