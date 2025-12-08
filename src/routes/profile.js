const express = require('express');
const router = express.Router();
const userAuth = require("../middleware/auth"); // Importing the authentication middleware
const {validateEditProfileData} = require("../utils/validation"); // Importing the validation function for editing profile

router.get("/profile/view",userAuth, async (req, res) => {
  try {
    const user = req.user; // The user object is attached to the request by the userAuth middleware

    res.send(user); // Sending the user data back to the client
  } catch (err) {
    res.status(400).send("Error " + err.message); // Sending an error response if something goes wrong
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req.body)) {
      throw new Error("Invalid fields for editing profile"); // If validation fails, throw an error
    }
    const loggedInUser = req.user; // it contains the orignal data of the logged-in user
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    }); // Updating the user object with the new data from the request body

    await loggedInUser.save(); // Saving the updated user object to the database

    res.json({
      message : "Profile updated successfully",
      data : loggedInUser, // Sending the updated user data back to the client
    });
     
  } catch (err) {
    res.status(400).send("Error " + err.message); // Sending an error response if something goes wrong
  }
});



module.exports = router; // Exporting the router to be used in the main app

