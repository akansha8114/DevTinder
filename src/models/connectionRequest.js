
const mongoose = require('mongoose');   // Importing mongoose for MongoDB object modeling
//Defining the connection request schema
const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type : mongoose.Schema.Types.ObjectId, // Using ObjectId type for MongoDB references
        ref: "User", // Referencing the User model means linking to the users collection
        required : true,
    },

    toUserId:{
        type: mongoose.Schema.Types.ObjectID,
        required : true,
    },
    status:{
        type:String,
        enum:{
            values:[ 'ignored','interested', 'accepted', 'rejected'], // Defining possible statuses for connection requests
            message: '{VALUE} is incorrect status type'
        },
    },

},
{ timestamps:true} // Automatically manage createdAt and updatedAt timestamps
);

//compound index to ensure uniqueness of connection requests between two users
connectionRequestSchema.index({fromUserId:1, toUserId:1}, {unique:true});

connectionRequestSchema.pre('save',function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send connection request to yourself");
    }
    next();
})

const ConnectRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema); // Creating a model for the connection request schema
module.exports = ConnectRequestModel;