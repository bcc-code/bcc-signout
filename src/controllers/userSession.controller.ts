import express from 'express'
import UserSessionService from '../services/userSession.service'
import debug from 'debug'
const log: debug.IDebugger = debug('controller:userSessions')

class UserSesssionController {
    async getAllUserSessions(req: express.Request, res: express.Response) {
        log(req, res)
        const userSessions = await UserSessionService.getAllUserSessions(
            req.params.userId
        )
        res.status(200).send(userSessions)
    }

    async storeUserSession(req: express.Request, res: express.Response) {
        log(req, res)
        try {
            const ok = await UserSessionService.storeUserSession({
                userId: req.params.userId,
                clientId: req.body.clientId,
                sessionId: req.body.sessionId,
                state: req.body.state
            })
            if(ok.status && ok.status === 400) {
                res.status(400).json({message: ok.message})
            } else {
                res.status(200).json({message: ok.message})
            }
        } catch (error) {
            res.status(500).json({message: "Encountered internal error, request was not succesfull"})
        }
        
    }
}

export default new UserSesssionController()
