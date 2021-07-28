import axios from "axios"
import { assert } from "chai"

describe('Signout service E2E test', function () {
    
    beforeEach(async () => {
        
    })

    it('stores login data and performs logout operation', async function () {
        const userId = "RANDOM_USER_ID"
        const registerSessionUrl = `http://localhost:4040/usersession/${userId}`
        const data = {
            "clientId": "CLIENT_ID",
            "sessionId": "SESSION_ID",
            "state": "SESSION_STATE"
        }
        const registerSessionRequestOptions = {
            headers: {
               Authorization: "AUTH0_SECRET" 
            }
        }
        let result = await axios.post(registerSessionUrl, data, registerSessionRequestOptions)
        console.log(result)


        const logoutUrl = `http://localhost:4040/logout/`
        const logoutRequestOptions = {
            params: {
                sessionId: data.sessionId,
                userId: userId
            }
        }
        let logoutResult = await axios.get(logoutUrl, logoutRequestOptions)
        console.log(logoutResult)
        assert(logoutResult.status === 200)
        assert(logoutResult.data.result.message === 'All logouts sucessfull.')
    })
})
