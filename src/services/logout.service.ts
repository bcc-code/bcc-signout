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

    private async fetchCallbackUrls(userSessions: string[]): Promise<string[]> {
        let data: string[] = []
        for (const userSession of userSessions) {
            const clientUrls = await redisClient.smembersAsync(userSession)
            clientUrls.forEach((element: string) => {
                data.push(element)
            })
        }

        return data.filter((value: string) => value !== null)
    }

    private async performLogouts(userId: string, callbackUrls: string[]) {
        let responses:any[] = []

        await Promise.all(callbackUrls.map(async (callbackUrl) => {
            const data = callbackUrl.split('::')
            const url = data[0]
            const method = data[1]
            const state = data[2]

            try {
                let reply = {status: '', statusText: ''};
                if(method === "GET") {
                    reply = await axios.get(url, {
                        params: {
                            state: state,
                        },
                    })
                } else if (method === "POST") {
                    reply = await axios.post(url, null, {
                        params: {
                            state: state,
                        },
                    })
                }
                
                responses.push({
                    status: reply.status,
                    message: reply.statusText,
                })
            } catch (error) {
                console.error(error)
                responses.push(error)
            }
        }));

        log(responses)
        return responses
    }

    private async cleanUpUserSessions(userSessions: string[]) {
        const reply = await redisClient.delAsync(userSessions)
        log(reply)
    }
}

export default new LogoutService()
