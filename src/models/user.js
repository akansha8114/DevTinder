//at this place we are defining the user schema
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        maxlength: 50 // Limiting the length of first name to 50 characters
    },
    lastName : {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true ,// Ensuring that email is unique for each user
        lowercase: true, // Storing email in lowercase to avoid case sensitivity issues
        trim: true, // Trimming whitespace from email
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email format");
            }
        }
    },
    password : {
        type : String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password");
            }
        }
    },
    age:{
        type : Number,
        min: 18, // Ensuring age is a non-negative number
    },
    gender:{
        type : String,
        validate(value){
            if(!['male','female','other'].includes(value)){
                throw new Error("Invalid gender");
            }
        }
    },
    photourl:{
        type : String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL");
            }
        }
    },
    about:{
        type : [String],
        default: "This is a default about section"
    },
    phone:{
        type : Number,
        maxlength:10 // Limiting phone number to 10 digits
    }
},
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

//Creating a user model for the user schema
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;