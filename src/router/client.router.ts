import express from 'express'
import ClientController from '../controllers/client.controller'

const router = express.Router()

router.route('/:clientId').post(ClientController.registerClient)

export { router as clientRouter }
