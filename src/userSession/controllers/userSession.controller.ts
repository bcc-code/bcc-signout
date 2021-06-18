import express from 'express';
import UserSessionService from '../services/userSession.service';
import debug from 'debug';
const log: debug.IDebugger = debug('app:userSessions-controller');

class UserSesssionController {
    
    async getAllUserSessions(req: express.Request, res: express.Response) {
        log(req, res)
        const userSessions = await UserSessionService.getAllUserSessions(req.params.userId);
        res.status(200).send(userSessions);
    }

    async storeUserSession(req: express.Request, res: express.Response) {
        log(req, res)
        const ok = await UserSessionService.storeUserSession(req.params.userId, req.body.appId);
        res.status(200).send(ok);
    }
}

export default new UserSesssionController();