const mongoose  = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Please provide username"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please provide email"],
        trim: true,
        match: [
            /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i,
            "Please provide valid email"
        ]
    },    
    password: {
        type: String,
        required: [true, "Please provide password"],
    },
    photo: {
        url: {
            type: String,
            required: [true, "Please provide url"],
            default: "https://res.cloudinary.com/ddcmktx4l/image/upload/v1685264118/UserProfile/hnwrzzcm9qygowqhm8nf.jpg"
        },
        public_id: {
            type: String,
            required: true,
            default: "abc"
    }
    }
},
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Usersdata', schema)
