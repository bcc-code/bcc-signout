import { body, param } from 'express-validator'

const notAStringMessage = 'Value was not a string'
export const logoutRequestValidationRules = () => {
    return [
        param('userId')
            .exists()
            .withMessage('User ID is missing')
            .isString()
            .withMessage(notAStringMessage),
        body('sessionId')
            .exists()
            .withMessage('Session ID is missing')
            .isString()
            .withMessage(notAStringMessage),
    ]
}
