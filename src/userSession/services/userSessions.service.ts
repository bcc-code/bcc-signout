import { SessionService } from "../../common/interfaces/sessionService.interface";
import debug from 'debug'

const redisClient = require('../../redis-client');
const debugLog: debug.IDebugger = debug('redis-client');

class UserSessionsService implements SessionService {
    async getAllUserSessions(userID: string) {
        const ok = await redisClient.smembersAsync(userID)
        return ok
    }

    async storeUserSession (userId: string, appId: string) {
        const ok = await redisClient.saddAsync(userId, appId)
        return {ok, userId, appId}
    };

}

export default new UserSessionsService();