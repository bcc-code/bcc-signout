import express from 'express'
import logoutController from './controllers/logout.controller'

const router = express.Router()

router.route('/:userId').post(logoutController.triggerLogout)

export { router as logoutRouter }
