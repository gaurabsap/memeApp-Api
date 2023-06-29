const mongoose = require('mongoose')


const ConnectDb = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        if(connect){
            console.log('Connect with database')
        }else{
            console.log('Failed to connect with db')
        }
    } catch (error) {
        console.log('Something wrong')
    }
}

module.exports = ConnectDb;
