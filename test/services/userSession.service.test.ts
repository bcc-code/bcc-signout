import { expect } from 'chai';
import userSessionService from '../../src/services/userSession.service';
import { UserSessionMetadata } from '../../src/interfaces/userSessionMetadata';
const redisTestInterface = require('../setup/redis-test-interface')


describe("UserService works properly", function() {
    const testUserSession:UserSessionMetadata = {
        appId: "APPID",
        userId: "USERID",
        sessionId: "SESSIONID",
        state: "STATE"
    }

    beforeEach(async ()=>{
        redisTestInterface.flushData()
    });

    it("stores user session", async function() {
        var result = await userSessionService.storeUserSession(testUserSession)

        expect(result).to.be.an('object').that.has.property("message", "OK")

        var readOut = redisTestInterface.client.get("USERID|SESSIONID|APPID", function(err:Error,res:any) {
            expect(res).to.be.a('string').to.contain("STATE")
        })
    })
})