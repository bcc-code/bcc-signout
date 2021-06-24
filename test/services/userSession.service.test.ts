import { expect } from 'chai';
import userSessionService from '../../src/services/userSession.service';
const redisTestInterface = require('../setup/redis-test-interface')


describe("UserService works properly", function() {

    beforeEach(async ()=>{
        redisTestInterface.flushData()
    });

    it("stores user session", async function() {
        var result = await userSessionService.storeUserSession("USERID", "APPID")

        expect(result).to.be.an('object').that.has.property("message", "OK")
        expect(result).to.be.an('object').that.has.property("userId", "USERID")
        expect(result).to.be.an('object').that.has.property("appId", "APPID")

        var readOut = redisTestInterface.client.smembers("USERID", function(err:Error,res:any) {
            expect(res).to.be.an('array').that.has.members(["APPID"])
        })
    })
})