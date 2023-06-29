
const express = require('express')
const {
    UserLogin, 
    UserRegister, 
    UserLogout, 
    UserProfile, 
    UserData, 
    UserUpdate, 
    UserPassUpdate ,
    ForgetPassword,
    ResetPassword} = require('../Controller/UserController')

    
const TokenChecker = require('../middleWare/TokenCheck')


const routes = express.Router()

routes.post('/register', UserRegister)
routes.post('/login', UserLogin)
routes.get('/logout', TokenChecker,  UserLogout)
routes.get('',TokenChecker, UserProfile)
routes.get('/data', TokenChecker, UserData)


//update

routes.put('/update/profile', TokenChecker, UserUpdate)
routes.put('/update/pass', TokenChecker, UserPassUpdate)



//forget password

routes.post('/forget-password', ForgetPassword)
routes.put('/reset-password/:token', ResetPassword)



module.exports = routes;