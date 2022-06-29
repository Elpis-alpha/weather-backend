require('./middleware/init')

require('./db/mongoose')

const express = require('express')

const chalk = require('chalk')

const cors = require('cors')

const userRouter = require('./routers/user')

const locationRouter = require('./routers/location')

const weatherRouter = require('./routers/weather')

const delay = require('./middleware/delay')

const port = process.env.PORT

const isProduction = process.env.IS_PRODUCTION === 'true'


// Acquire an instance of Express
const app = express()


// Automatically allow incoming cors
app.use(cors())


// One second delay for local development
if (!isProduction) { app.use(delay) }


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

  console.log(chalk.hex('#009e00')(`Server started successfully on port ${port}`));

  console.log(chalk.cyanBright(`Server time: ${new Date().toLocaleString()}`));

})
