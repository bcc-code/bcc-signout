import { UserSessionMetadata } from './userSessionMetadata.interface'
export interface SessionService {
    storeUserSession: (userSessionMetadata: UserSessionMetadata) => Promise<any>
}
