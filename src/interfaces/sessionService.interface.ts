import { UserSessionMetadata } from "./userSessionMetadata";
export interface SessionService {
    getAllUserSessions: (userID: string) => Promise<any>
    storeUserSession: (userSessionMetadata:UserSessionMetadata) => Promise<any>
}
