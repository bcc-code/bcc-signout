import { SessionService } from "../../common/interfaces/sessionService.interface";
const redisClient = require('../../redis-client');

class UserSessionService implements SessionService {
    async getAllUserSessions(userId: string) {
        const ok = await redisClient.smembersAsync(userId)
        return ok
    }

    async storeUserSession (userId: string, appId: string) {
        const ok = await redisClient.saddAsync(userId, appId)
        return {ok, userId, appId}
    };

}

export default new UserSessionService();