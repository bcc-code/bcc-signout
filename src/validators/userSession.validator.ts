import { body, param, header } from 'express-validator'

const notAStringMessage = 'Value was not a string'
export const userSessionValidationRules = () => {
    return [
        header('Authorization')
            .exists()
            .custom(value => value === process.env.AUTH0_SECRET),
        param('userId')
            .exists()
            .withMessage('User ID is missing')
            .isString()
            .withMessage(notAStringMessage),
        body('clientId')
            .exists()
            .withMessage('Client ID is missing')
            .isString()
            .withMessage(notAStringMessage),
        body('sessionId')
            .exists()
            .withMessage('Session ID is missing')
            .isString()
            .withMessage(notAStringMessage),
        body('state')
            .exists()
            .withMessage('State is missing')
            .isString()
            .withMessage(notAStringMessage),
    ]
}
