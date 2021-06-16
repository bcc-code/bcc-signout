import express from 'express';
import userSessionService from '../services/userSession.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:userSessions-controller');
class UsersController {
    async getAllUserSessions(req: express.Request, res: express.Response) {
        const userSessions = userSessionService.getAllUserSessions(req.body.userId);
        res.status(200).send(userSessions);
    }

    async storeUserSession(req: express.Request, res: express.Response) {
        const ok = userSessionService.storeUserSession(req.body.userId, req.body.appId);
        res.status(200).send(ok);
    }
}

export default new UsersController();