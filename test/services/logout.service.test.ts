import { expect } from 'chai'
import userSessionService from '../../src/services/userSession.service'
import logoutService from '../../src/services/logout.service'
import { UserSessionMetadata } from '../../src/interfaces/userSessionMetadata.interface'
import { LogoutMetadata } from '../../src/interfaces/logoutMetadata.interface'
const redisTestInterface = require('../setup/redis-test-interface')

describe('UserService works properly', function () {
    const testUserSession: UserSessionMetadata = {
        clientId: 'CLIENTID',
        userId: 'USERID',
        sessionId: 'SESSIONID',
        state: 'STATE',
    }

    const logoutMetadata: LogoutMetadata = {
        sessionId: 'SESSIONID',
        state: 'STATE',
        userId: 'USERID',
    }

    beforeEach(async () => {
        redisTestInterface.flushData()
        await userSessionService.storeUserSession(testUserSession)
    })

    it('properly tries to logout', async function () {
        var result = await logoutService.performFederatedLogout(logoutMetadata)
        expect(result).to.be.an('object')
        expect(result).to.have.deep.property('message')
        expect(result).to.have.deep.property('result')
        expect(result.message).to.equal('Some logouts might have errors.')
        expect(result.result).to.equal('OK')
    })
})
