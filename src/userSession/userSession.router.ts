import express from 'express';
import UserSessionsController from './controllers/userSession.controller';

const router = express.Router()

router.route("/")
    .get((req: express.Request, res: express.Response) => {
        res.status(200).send(`List of active user sessions`);
    })

router.route("/:userId")
    .get(UserSessionsController.getAllUserSessions)
    .post(UserSessionsController.storeUserSession)

export { router as userSessionsRouter };