const express = require('express');
const router = express.Router();
const userAuth = require("../middleware/auth"); // Importing the authentication middleware

router.get("/profile",userAuth, async (req, res) => {
  try {
    const user = req.user; // The user object is attached to the request by the userAuth middleware

    res.send(user); // Sending the user data back to the client
  } catch (err) {
    res.status(400).send("Error " + err.message); // Sending an error response if something goes wrong
  }
});

module.exports = router; // Exporting the router to be used in the main app

