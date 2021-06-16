import { SessionService } from "../../common/interfaces/sessionService.interface";


class UserSessionsService implements SessionService {
    async getAllUserSessions(userID: string) {
        return userID
    }

    async storeUserSession (userId: string, appId: string) {
        return {userId, appId}
    };

}

export default new UserSessionsService();