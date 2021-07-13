import { validationResult } from 'express-validator'
import express from 'express'

export const validate = (
    req: express.Request,
    res: express.Response,
    next: Function
) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors: any[] = []
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        message: 'Validation errors',
        errors: extractedErrors,
    })
}
