const express = require('express');
const router = express.Router();
const userAuth = require("../middleware/auth"); // Importing the authentication middleware

router.post("/sendconnectionrequest",userAuth,async(req,res)=>{  
  try{
    const user = req.user; // The user object is attached to the request by the userAuth middleware
    res.send(user.firstName + " Sent the Connection request  " );
  }catch(err){
    res.status(400).send("Error " + err.message); // Sending an error response if something goes wrong
  }
  
});

module.exports = router; // Exporting the router to be used in the main app