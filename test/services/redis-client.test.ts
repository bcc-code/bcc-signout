import { expect } from 'chai';
const redisClient = require('../../src/services/redis-client')
const redisTestInterface = require('../setup/redis-test-interface')

describe('redis operations', function() {

    beforeEach(async ()=>{
        redisTestInterface.flushData()
    });


    it('redis-client can store and read simple keys', async function() {
        var result = await redisClient.setAsync("TESTKEY", "TESTVALUE")
        expect(result).to.equal("OK")

        var readOut = await redisClient.getAsync("TESTKEY")
        expect(readOut).to.equal("TESTVALUE")
    })

    it('redis-client can get multiple keys', async function() {
        var result = await redisClient.setAsync("TESTKEY", "TESTVALUE")
        expect(result).to.equal("OK")

        result = await redisClient.setAsync("TESTKEY2", "TESTVALUE")
        expect(result).to.equal("OK")

        result = await redisClient.setAsync("TESTKEY3", "TESTVALUE")
        expect(result).to.equal("OK")

        var readOut = await redisClient.mgetAsync("TESTKEY", "TESTKEY2", "TESTKEY3")
        expect(readOut).to.be.an('array').that.has.members(["TESTVALUE", "TESTVALUE", "TESTVALUE"])
    })

    it("redis-client can store and read sets", async function() {
        var result = await redisClient.saddAsync("SETKEY", "KEY1")
        expect(result).to.equal(1)

        result = await redisClient.saddAsync("SETKEY", "KEY2")
        expect(result).to.equal(1)

        result = await redisClient.saddAsync("SETKEY", "KEY2")
        expect(result).to.equal(0)

        result = await redisClient.saddAsync("SETKEY", "KEY3", "KEY4")
        expect(result).to.equal(2)

        var readOut = await redisClient.smembersAsync("SETKEY")
        expect(readOut).to.be.an('array').that.has.members([ 'KEY2', 'KEY4', 'KEY3', 'KEY1' ]);
    })
})