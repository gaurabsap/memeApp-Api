const mongoose = require('mongoose')



const tokenSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiredAt: {
        type: Date
    }

})


module.exports = mongoose.model('token', tokenSchema)