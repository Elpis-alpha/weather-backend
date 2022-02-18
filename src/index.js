const express = require('express')

const chalk = require('chalk')
const { createProxyMiddleware } = require('http-proxy-middleware')


const mongoose = require('./db/mongoose')

const userRouter = require('./routers/user')

const locationRouter = require('./routers/location')

const weatherRouter = require('./routers/weather')

const port = process.env.PORT


// Acquire an instance of Express
const app = express()


// Automatically parse incoming reqests
app.use(express.json())


// Automatically allows user routers
app.use(userRouter)


// Automatically allows task routers
app.use(locationRouter)


// Automatically allows dummy routers
app.use(weatherRouter)


// Listening Server
app.listen(port, () => {

  console.log(chalk.yellow('\n\nInitializing Server'));

  console.log(`Server starting on port ${port}`);

})