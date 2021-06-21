import { body } from 'express-validator'

export const userSessionValidationRules = () => {
    return [
        body('userId').exists().isString(),
        body('appId').exists().isString(),
    ]
}