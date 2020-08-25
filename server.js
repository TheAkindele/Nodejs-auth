const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

//import router files
const authRouter = require('./router-folder/authRouter')
const postRouter = require('./router-folder/postRouter')

//middleware
app.use(express.json())     //body parser middleware
app.use(express.urlencoded({ extended: false }))        //form validation middleware

// use routers
app.use('/api/user', authRouter)
app.use('/post', postRouter)

//connect mongoose to database.
mongoose.connect(
    process.env.DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    () => console.log(`Connected to DB`)
)

// create port and listen to server
const PORT = process.env.port || 9000
app.listen(PORT, () => console.log(`server is running on port ${PORT}`))


