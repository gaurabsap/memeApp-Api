const mongoose = require('mongoose')


const ConnectDb = async() => {
    try {
        const connect = await mongoose.connect('mongodb://127.0.0.1:27017/Appgb')
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