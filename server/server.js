const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const postsRoutes = require('./routes/posts')
const userRoutes = require('./routes/users')

const app = express()
app.use(cors())

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(express.json())

app.use('/posts', postsRoutes)
app.use('/users', userRoutes)

const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL
const PORT = process.env.PORT || 5000
mongoose
	.connect(MONGO_CONNECTION_URL)
	.then(() =>
		app.listen(PORT, () => console.log(`server running on port: ${PORT}`))
	)
	.catch((err) => console.error(err))
