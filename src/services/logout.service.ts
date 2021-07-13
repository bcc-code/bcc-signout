import debug from 'debug'
import axios from 'axios'
import { LogoutMetadata } from '../interfaces/logoutMetadata.interface'

const redisClient = require('./redis-client')
const log: debug.IDebugger = debug('service:logout')
const noAction = { result: 'OK', message: 'No logouts were made.' }

class LogoutService {
    async performFederatedLogout(logoutMetadata: LogoutMetadata) {
        const pattern = [
            logoutMetadata.userId,
            logoutMetadata.sessionId,
            '*',
        ].join('::')
        const userSessions = await redisClient.keysAsync(pattern)
        if (userSessions.length === 0) {
            return {
                ...noAction,
                cause: 'No sessions for this user were found',
            }
        }

        const callbacks = await this.fetchCallbackUrls(userSessions)
        if (callbacks.length === 0) {
            return { ...noAction, cause: 'No urls have been found' }
        }

        const validatedState = this.validateState(
            logoutMetadata.state,
            callbacks
        )
        if (!validatedState) {
            return { ...noAction, cause: 'State variables do not match' }
        }

        await this.cleanUpUserSessions(userSessions)

        const statuses = await this.performLogouts(
            logoutMetadata.userId,
            callbacks
        )
        if (statuses.length === 0) {
            return noAction
        }

        if (statuses.some((response) => response instanceof Error)) {
            return {
                result: 'OK',
                message: 'Some logouts might have errors.',
                responses: statuses,
            }
        }
        return { result: 'OK', message: 'All logouts sucessfull.' }
    }

    async fetchCallbackUrls(userSessions: string[]): Promise<string[]> {
        let data:string[] = []
        userSessions.forEach(async userSession => {
            const clientUrls = await redisClient.smembersAsync(userSession)
            clientUrls.forEach((element:string) => {
                data.push(element)                
            });
        });
        
        return data.filter((value: string) => value !== null)
    }

    async performLogouts(userId: string, callbackUrls: string[]) {
        let responses = []
        for (const callback of callbackUrls) {
            const data = callback.split('::')
            const url = data[0]
            const state = data[1]

            try {
                const reply = await axios.post(url, null, {
                    params: {
                        userId: userId,
                        state: state,
                    },
                })
                responses.push({
                    status: reply.status,
                    message: reply.statusText,
                })
            } catch (error) {
                console.error(error)
                responses.push(error)
            }
        }
        log(responses)
        return responses
    }

    async cleanUpUserSessions(userSessions: string[]) {
        const reply = await redisClient.delAsync(userSessions)
        log(reply)
    }

    validateState(receivedState: string, callbacks: string[]): boolean {
        log(receivedState, callbacks)
        let validated = false
        for (const callback of callbacks) {
            const data = callback.split('::')
            const url = data[0]
            const state = data[1]

            if (receivedState === state) {
                validated = true
                break
            }
        }

        return validated
    }
}

export default new LogoutService()
