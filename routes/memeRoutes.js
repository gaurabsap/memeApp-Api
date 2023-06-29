const express = require('express')
const {CreateMemes, GetMemes, PostData, TrendMemes,PopularMemes, Like, DisLike} = require('../Controller/memeController.js')
const TokenChecker = require('../middleWare/TokenCheck')


const route = express.Router()



route.post('/create',TokenChecker, CreateMemes)
route.get('/memes/data', GetMemes)
route.get('/memes/trend', TrendMemes)
route.get('/memes/popular', PopularMemes)
route.get('/post/:id', PostData)



//like and dislike button

route.put('/like', TokenChecker, Like)
route.put('/like', TokenChecker, DisLike)


module.exports = route;