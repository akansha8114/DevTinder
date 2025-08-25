const express = require('express');
const router = express.Router();
const userAuth = require("../middleware/auth"); // Importing the authentication middleware
const ConnectionRequest = require("../models/connectionRequest"); // Importing the connection request model


router.get("/user/request", userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName age photourl gender about skills");
        res.json({
            message:"Connection requests fetched successfully",
            data: connectionRequests,
        })

    }catch(err){
        res.status(400).send("Erro" + err.message);
    }

})

module.exports = router; // Exporting the router to be used in the main app
