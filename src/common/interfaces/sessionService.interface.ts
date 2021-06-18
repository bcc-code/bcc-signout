export interface SessionService {
    getAllUserSessions: (userID: string) => Promise<any>
    storeUserSession: (userId: string, appId: string) => Promise<any>
}
