import express from 'express'
import UserSessionsController from '../controllers/userSession.controller'
import {userSessionValidationRules} from '../validators/userSession.validator'
import {validate} from '../middlewares/validate.middleware'

const router = express.Router()

router
    .route('/:userId')
    .get(UserSessionsController.getAllUserSessions)
    .post(
        userSessionValidationRules(),
        validate,
        UserSessionsController.storeUserSession
    )

export { router as userSessionsRouter }
