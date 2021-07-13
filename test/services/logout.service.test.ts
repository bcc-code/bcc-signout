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
        var result = await userSessionService.storeUserSession(testUserSession)

        expect(result).to.be.an('object').that.has.property('message', 'OK')

        var readOut = redisTestInterface.client.smembers(
            'USERID::SESSIONID::CLIENTID',
            function (err: Error, res: any) {
                console.log(res)
                expect(res).to.be.an('array')
                res.forEach((element: string) => {
                    expect(element).to.be.a('string')
                    expect(element).to.contain('STATE')
                })
            }
        )
    })
})
