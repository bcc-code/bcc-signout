import express from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';
import dotenv from 'dotenv';
import { userSessionsRouter } from './userSession/userSession.router';
import { logoutRouter } from './logout/logout.router';
import { clientRouter } from './clients/client.router';

const dotenvResult = dotenv.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT ?? 3000;

const debugLog: debug.IDebugger = debug('app');

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false;
    if (typeof global.it === 'function') {
        loggerOptions.level = 'http';
    }
}

app.use(express.json())
//app.use(cors);
app.use(expressWinston.logger(loggerOptions));


const runningMessage = `Server running at http://localhost:${port}`;
app.use('/usersession', userSessionsRouter)
app.use('/logout',logoutRouter)
if(process.env.NODE_ENV === "development") {
    app.use('/client', clientRouter)
}

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
});

server.listen(port, () => {
    console.log(runningMessage);
});

