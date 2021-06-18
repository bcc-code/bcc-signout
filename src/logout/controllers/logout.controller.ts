import express from 'express'
import debug from 'debug'
import LogoutService from '../services/logout.service'
const log: debug.IDebugger = debug('app:logout-controller')

class LogoutController {
    async triggerLogout(req: express.Request, res: express.Response) {
        log(req.params)
        const logoutActions = await LogoutService.performFederatedLogout(
            req.params.userId
        )
        if (logoutActions.result === 'OK') {
            res.status(200).send(logoutActions.message)
        } else {
            res.status(500).send()
        }
    }
}

export default new LogoutController()
