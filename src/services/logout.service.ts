import debug from 'debug'
import axios from 'axios'
const redisClient = require('./redis-client')
const log: debug.IDebugger = debug('app:logout-service')
const noAction = { result: 'OK', message: 'No logouts were made.' }

class LogoutService {
    async performFederatedLogout(userId: string) {
        const userSessions = await redisClient.smembersAsync(userId)
        if (userSessions.length === 0) {
            return noAction
        }
        const callbacks = await this.fetchCallbackUrls(userSessions)
        if (callbacks.length === 0) {
            return noAction
        }
        const statuses = await this.performLogouts(userId, callbacks)
        if (statuses.length === 0) {
            return noAction
        }
        return { result: 'OK', message: 'All logouts sucessfull.' }
    }

    async fetchCallbackUrls(userSessions: string[]) {
        const data = await redisClient.mgetAsync(userSessions)
        return data.filter((value: string) => value !== null)
    }

    async performLogouts(userId: string, callbackUrls: string[]) {
        let responses = []
        for (const url of callbackUrls) {
            try {
                const finalUrl = url + '?userId=' + userId
                const reply = await axios.post(finalUrl)
                responses.push({
                    status: reply.status,
                    message: reply.statusText,
                })
            } catch (error) {
                console.error(error)
            }
        }
        log(responses)
        return responses
    }
}

export default new LogoutService()
