import express from 'express';
import debug from 'debug';
const log: debug.IDebugger = debug('app:client-controller');

class ClientController {
    
    async registerClient(req: express.Request, res: express.Response) {
        log(req.params)
        const registered = await true
        res.status(200).send(registered)
    }
}

export default new ClientController();