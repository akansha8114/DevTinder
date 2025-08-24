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

module.exports = router; // Exporting the router to be used in the main app