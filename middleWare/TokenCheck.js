const jwt = require('jsonwebtoken')


const TokenChecker = async(resq, resp, next) => {
    const {token} = resq.cookies
    jwt.verify(String(token), "GAURAB", (error, user) => {
        if(error){
            return resp.status(404)
        }else{
            resq.id = user.id
            next()
        }
    })

}


module.exports = TokenChecker