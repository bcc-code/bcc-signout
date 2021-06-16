import { CommonRoutesConfig } from '../common/routes.config';
import UserSesssionsController from './controllers/userSessions.controller';
import express from 'express';

export class UserSessionsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UserSessionsRoutes');
    }

    configureRoutes(): express.Application {
        this.app.route(`/usersessions`)
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`List of active user sessions`);
            })

        this.app.route(`/usersessions/:userId`)
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                console.log("All hit")
                console.log(req.body)
                next();
            })
            .get(UserSesssionsController.getAllUserSessions)
            .post(UserSesssionsController.storeUserSession)

        return this.app;
    }
}