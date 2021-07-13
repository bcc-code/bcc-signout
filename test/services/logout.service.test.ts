import { expect } from 'chai'
import userSessionService from '../../src/services/userSession.service'
import logoutService from '../../src/services/logout.service'
import { UserSessionMetadata } from '../../src/interfaces/userSessionMetadata.interface'
const redisTestInterface = require('../setup/redis-test-interface')

describe('UserService works properly', function () {
    const testUserSession: UserSessionMetadata = {
        clientId: 'CLIENTID',
        userId: 'USERID',
        sessionId: 'SESSIONID',
        state: 'STATE',
    }

    beforeEach(async () => {
        redisTestInterface.flushData()
        await userSessionService.storeUserSession(testUserSession)
    })

    it('properly tries to logout', async function () {
        
    })
})
