import express from 'express'
import * as http from 'http'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import debug from 'debug'
import dotenv from 'dotenv'
import { userSessionsRouter } from './router/userSession.router'
import { logoutRouter } from './router/logout.router'
import { clientRouter } from './router/client.router'
import errorMiddleware from './middlewares/error.middleware'



const app: express.Application = express()
const server: http.Server = http.createServer(app)
const port = process.env.PORT ?? 4040
const hostname = app.get("host")

const debugLog: debug.IDebugger = debug('app')

debugLog(process.env)

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
}

if (!process.env.DEBUG) {
    loggerOptions.meta = false
    if (typeof global.it === 'function') {
        loggerOptions.level = 'http'
    }
}

app.use(express.json())
app.use(expressWinston.logger(loggerOptions))
app.use(errorMiddleware)

app.use('/usersession', userSessionsRouter)
app.use('/logout', logoutRouter)
if (process.env.NODE_ENV === 'development') {
    app.use('/client', clientRouter)
}

const runningMessage = `Server running at ${hostname}:${port}, Trying to connect to redis instance ${process.env.REDIS_HOST}:${process.env.REDIS_PORT} `
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
})

export default

server.listen(port, () => {
    console.log(runningMessage)
})
