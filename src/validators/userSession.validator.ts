import { body } from 'express-validator'

const notAStringMessage = "Value was not a string"
export const userSessionValidationRules = () => {
    return [
        body('userId').exists().withMessage("User ID is missing").isString().withMessage(notAStringMessage),
        body('appId').exists().withMessage("Client ID is missing").isString().withMessage(notAStringMessage),
        body('sesionId').exists().withMessage("Session ID is missing").isString().withMessage(notAStringMessage),
    ]
}
