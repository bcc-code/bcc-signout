import { CommonRoutesConfig } from '../common/routes.config';
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
            .post((req: express.Request, res: express.Response) => {
                res.status(200).send(`Post to user sessions`);
            });

        this.app.route(`/usersessions/:userId`)
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                console.log("All hit")
                next();
            })
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`GET requested for id ${req.params.userId}`);
            })
            .put((req: express.Request, res: express.Response) => {
                res.status(200).send(`PUT requested for id ${req.params.userId}`);
            })
            .patch((req: express.Request, res: express.Response) => {
                res.status(200).send(`PATCH requested for id ${req.params.userId}`);
            })
            .delete((req: express.Request, res: express.Response) => {
                res.status(200).send(`DELETE requested for id ${req.params.userId}`);
            });

        return this.app;
    }
}