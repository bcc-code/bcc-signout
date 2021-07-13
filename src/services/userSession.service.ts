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
        if (appUrls === '') {
            return { status: 400, message: 'Client ID not found' }
        }

        const { userSessionKey, userSessionCallbackUrls } = this.createUserSessionStorageData(userSession, appUrls)
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

    private createUserSessionStorageData(userSession: UserSessionMetadata, appUrls: string[]): {userSessionKey: string, userSessionCallbackUrls:string[]} {
        let userSessionCallbackUrls:string[] = [];
        const userSessionKey = [
            userSession.userId,
            userSession.sessionId,
            userSession.clientId,
        ].join('::')
        appUrls.forEach(url => {
            userSessionCallbackUrls.push([url, userSession.state].join('::'))
        });
        return { userSessionKey, userSessionCallbackUrls }
    }
}

export default new UserSessionService()
