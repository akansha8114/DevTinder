//at this place we are defining the user schema
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    age:{
        type : Number
    },
    gender:{
        type : String
    }
});

//Creating a user model for the user schema
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;