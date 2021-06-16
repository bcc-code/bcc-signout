import { SessionService } from "../../common/interfaces/sessionService.interface";
const redisClient = require('../../redis-client');
class UserSessionsService implements SessionService {
    async getAllUserSessions(userID: string) {
        const ok = await redisClient.getAsync(userID)
        return ok
    }

    async storeUserSession (userId: string, appId: string) {
        const ok = await redisClient.setAsync(userId, appId)
        return {ok, userId, appId}
    };

}

export default new UserSessionsService();