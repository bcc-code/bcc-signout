import debug from 'debug'
import axios from 'axios'
const redisClient = require('../../redis-client')
const log: debug.IDebugger = debug('app:logout-service')

class LogoutService {
    async performFederatedLogout(userId: string) {
        const userSessions = await redisClient.smembersAsync(userId)
        const callbacks = await this.fetchCallbackUrls(userSessions)
        const statuses = await this.performLogouts(userId, callbacks)
        return `logout performed for user ${userId} on these aps: ${userSessions}, by using these callbacks ${callbacks} with these statuses: ${statuses}`
    }

    async fetchCallbackUrls(userSessions: string[]) {
        const data = await redisClient.mgetAsync(userSessions)
        return data.filter((value: string) => value !== null)
    }

    async performLogouts(userId: string, callbackUrls: string[]) {
        let responses = []
        for (const url of callbackUrls) {
            try {
                const finalUrl = url + "?userId=" + userId
                const reply = await axios.post(finalUrl)
                log(reply)
                responses.push(reply)
            } catch (error) {
                console.error(error)
            }       
        }
        log(responses)
        return responses
    }
}

export default new LogoutService()
