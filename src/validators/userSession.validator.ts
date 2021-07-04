import { body, param } from 'express-validator'

const notAStringMessage = "Value was not a string"
export const userSessionValidationRules = () => {
    return [
        param('userId').exists().withMessage("User ID is missing").isString().withMessage(notAStringMessage),
        body('appId').exists().withMessage("Client ID is missing").isString().withMessage(notAStringMessage),
        body('sessionId').exists().withMessage("Session ID is missing").isString().withMessage(notAStringMessage),
        body('state').exists().withMessage("State is missing").isString().withMessage(notAStringMessage)
    ]
}
