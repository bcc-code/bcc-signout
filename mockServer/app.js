const express = require('express')
const app = express()
const port = 5555

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/logout', (req, res) => {
    res.status(200).send(
        `Logged Out user: ${req.query.userId} state: ${req.query.state}`
    )
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
