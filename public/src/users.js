const mongoose = require('./db')
const userSchema = mongoose.Schema({
    email : {
        type : String
    },
    password : {
        type : String
    },
    age : {
        type : String
    }
},{
    timestamps:true
})
const User = mongoose.model('User',userSchema)

module.exports = User