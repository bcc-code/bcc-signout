import { UserSessionMetadata } from "./userSessionMetadata.interface";
export interface SessionService {
    getAllUserSessions: (userID: string) => Promise<any>
    storeUserSession: (userSessionMetadata:UserSessionMetadata) => Promise<any>
}
