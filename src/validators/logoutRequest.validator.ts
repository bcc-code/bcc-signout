import { body, param, query } from 'express-validator'

const notAStringMessage = 'Value was not a string'
export const logoutRequestValidationRules = () => {
    return [
        query('userId')
            .exists()
            .withMessage('User ID is missing')
            .isString()
            .withMessage(notAStringMessage),
        query('sessionId')
            .exists()
            .withMessage('Session ID is missing')
            .isString()
            .withMessage(notAStringMessage),
    ]
}
