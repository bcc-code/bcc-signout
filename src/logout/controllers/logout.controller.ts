import express from 'express';
import debug from 'debug';
const log: debug.IDebugger = debug('app:logout-controller');

class LogoutController {
    
    async triggerLogout(req: express.Request, res: express.Response) {
        log(res, req)
        const logoutActions = await true
        res.status(200).send(logoutActions)
    }
}

export default new LogoutController();