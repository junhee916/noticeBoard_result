require('dotenv').config()
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const morgan = require('morgan')

const userRouter = require('./routes/user')
const boardRouter = require('./routes/board')
const commendRouter = require('./routes/commend')
const indexRouter = require('./routes/index')

// require mongodb
const connectDB = require('./config/database')
connectDB()

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use(morgan('dev'))

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/board', boardRouter)
app.use('/commend', commendRouter)

app.set('views', __dirname+'/views');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

const PORT = process.env.PORT || 7000
app.listen(PORT, console.log("connected server..."))