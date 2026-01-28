const express = require('express');
const router = express.Router();
const {userAuth} = require("../middleware/auth"); // Importing the authentication middleware
const ConnectionRequest = require("../models/connectionRequest"); // Importing the connection request model
const User = require("../models/user"); // Importing the user model


const USER_SAFE_DATA = "firstName lastName age photourl gender about skills";


router.get("/user/requests/recieved", userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);
        res.json({
            message:"Connection requests fetched successfully",
            data: connectionRequests,
        });

    }catch(err){
        res.status(400).send("Erro" + err.message);
    }

});

router.get("/user/connections", userAuth , async(req,res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId : loggedInUser._id, status: "accepted"},
                {toUserId : loggedInUser._id, status: "accepted"},
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        console.log(connectionRequests);

        //Extracting the connctions whether it is from fromUserId or toUserId
        const data = connectionRequests.map((row)=> {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }else{
                return row.fromUserId;
            }
        }); // Extracting the fromUserId field from each connection request
        res.json({ data });
    }catch(err){
        res.status(400).send("Error " + err.message);
    }
});

//User should see all the user cards except his own card and the users with whom he has already connected
//also except the users to whom he has sent the connection request and the users whom he ignored
router.get("/feed", userAuth, async(req,res) => {
    try{

        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        let limit = parseInt(req.query.limit) || 10; // Default to 10
        limit = limit>50 ? 50 : limit; // Max limit of 50
        const skip = (page-1)*limit;
        //Find all the connection requests (sent+recieved)
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id},
            ]
        }).select("fromUserId toUserId status");

        //Create a set of user ids to be hidden from the feed
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        //Storing the rest of the id who cards not in the hideUsersFromFeed set
        const users = await User.find({
            $and:[
                {_id: {$nin:Array.from(hideUsersFromFeed)}}, // Exclude users in the hideUsersFromFeed set
                {_id: {$ne: loggedInUser._id}}, // Exclude the logged-in user
            
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit); // Select only safe data fields
        res.json({
            message: "User feed fetched successfully",
            data: users,
        });

    }catch(err){
        res.status(400).send("Error " + err.message);
    }
})

module.exports = router; // Exporting the router to be used in the main app
