import express from 'express'
import logoutController from '../controllers/logout.controller'
import { validate } from '../middlewares/validate.middleware'
import { logoutRequestValidationRules } from '../validators/logoutRequest.validator'

const router = express.Router()

router
    .route('/:userId')
    .post(
        logoutRequestValidationRules(),
        validate,
        logoutController.triggerLogout
    )

export { router as logoutRouter }
