const express = require('express');
const router = express.Router();
const userAuth = require("../middleware/auth"); // Importing the authentication middleware
const ConnectionRequest = require("../models/connectionRequest"); // Importing the connection request model
const { message } = require('statuses');
const { Connection } = require('mongoose');

router.post("/request/:status/:toUserId", userAuth, async(req,res) => {  
  try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored","interested"]
    if(!allowedStatus.includes(status)){
      return res.status(400).send("Invalid status type");
    }

    //creating a new connection request
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    // Check if there is already a connection request between the two users
    const existingconnectionRequest = await ConnectionRequest.findOne({
      $or : [
        {fromUserId, toUserId},
        {fromUserId: toUserId , toUserId: fromUserId}
      ]
    })

    if(existingconnectionRequest){
      return res.status(400).send("Connection request already exists between these users");
    }

    const data = await connectionRequest.save(); // Saving the connection request to the database
    res.json({
      message: req.user.firstName + " is " + status + " in " , // Sending a success message
      data // Sending the saved connection request data in the response
    })

  }catch(err){
    res.status(400).send("Error " + err.message); // Sending an error response if something goes wrong
  }
  
});

router.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
    const loggedInUser = req.user._id;
    const {status,requestId} = req.params;

    const allowedStatus = ["accepted","rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).send("Invalid status type");
    }
    // Fetch the connection request to ensure it exists and is directed to the logged-in user
    const connectionRequest = await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested",
    });
    if(!connectionRequest){
      return res.status(404).send("No pending connection request found");
    }
    connectionRequest.status = status; // Updating the status of the connection request
    const data = await connectionRequest.save(); // Saving the updated connection request
    res.json({
      message: "Connection request " + status + " successfully",
      data
    })
  }catch(err){
    res.status(400).send("Error " + err.message);
  }
})

module.exports = router; // Exporting the router to be used in the main app