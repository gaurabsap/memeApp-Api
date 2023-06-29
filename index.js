const express = require('express')
const cors = require('cors')
const ConnectDb = require('./model/db')
const routes = require('./routes/userRoutes')
const memes = require('./routes/memeRoutes')
const cookieparser = require('cookie-parser')
const dotenv = require('dotenv')


const app = express()
dotenv.config()
app.use(cookieparser())
app.use(express.json({limit: '200mb'}));
app.use(express.urlencoded({limit: '200mb', extended: false}));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))
app.use('/api/users', routes)
app.use('/api', memes)

app.listen(4000, () => {
    ConnectDb();
    console.log('Server is running...');
})