import express from 'express'
import debug from 'debug'
import LogoutService from '../services/logout.service'
const log: debug.IDebugger = debug('controller:logout')

class LogoutController {
    async triggerLogout(req: express.Request, res: express.Response) {
        log(req.params)
        if (req.query.userId && req.query.sessionId) {
            const logoutActions = await LogoutService.performFederatedLogout({
                userId: req.query.userId.toString(),
                sessionId: req.query.sessionId.toString(),
            })
            if (logoutActions.result === 'OK') {
                res.status(200).json({ result: logoutActions })
            } else {
                res.status(500).json({
                    message:
                        'Encountered internal error, request was not succesfull',
                })
            }
        } else {
            res.status(422).json({
                message: 'Query params are missing',
            })
        }
    }
}

export default new LogoutController()
