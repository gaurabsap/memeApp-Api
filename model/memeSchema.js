const mongoose = require('mongoose')


const memeSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usersdata',
        required: true
    },
    user: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required : [true, "please provide title"]
    },
    file: {
        public_id: {
            type: String,
            required: true
        },        
        url: {
            type: String,
            required: true
        },
    },
    like: {
        type: Number,
        default: 0,
    },
    dislike: {
        type: Number,
        default: 0
    }
}, 
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Memesdata', memeSchema)