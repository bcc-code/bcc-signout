import { expect } from 'chai'
import userSessionService from '../../src/services/userSession.service'
import { UserSessionMetadata } from '../../src/interfaces/userSessionMetadata.interface'
const redisTestInterface = require('../setup/redis-test-interface')

describe('UserService works properly', function () {
    const testUserSession: UserSessionMetadata = {
        clientId: 'CLIENT_ID',
        userId: 'USERID',
        sessionId: 'SESSIONID',
        state: 'STATE',
    }

    beforeEach(async () => {
        redisTestInterface.flushData()
    })

    it('stores user session', async function () {
        var result = await userSessionService.storeUserSession(testUserSession)

        expect(result).to.be.an('object').that.has.property('message', 'OK')

        var readOut = redisTestInterface.client.smembers(
            'USERID::SESSIONID::CLIENT_ID',
            function (err: Error, res: any) {
                console.log(res)
                expect(res).to.be.an('array')
                res.forEach((element: string) => {
                    expect(element).to.be.a('string')
                    expect(element).to.contain('STATE')
                    expect(element).to.contain('GET')
                })
            }
        )
    })
})
