import express from 'express'
import debug from 'debug'
import ClientService from '../services/client.service'
const log: debug.IDebugger = debug('app:client-controller')

class ClientController {
    async registerClient(req: express.Request, res: express.Response) {
        log(req.params, req.body)
        const registered = await ClientService.registerClient(
            req.params.clientId,
            req.body.callbackUrl
        )
        res.status(200).send(registered)
    }
}

export default new ClientController()
