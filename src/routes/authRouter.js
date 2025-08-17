const express = require('express');
const router = express.Router();
const validateSignupData = require("../utils/validation"); // Importing the validation function
const bcrypt = require("bcrypt"); // Importing bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Importing jsonwebtoken for creating JWT tokens

const User = require("../models/user"); // Assuming you have a User model defined

router.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignupData(req); // This will throw an error if validation fails
    const { firstName, lastName, email, password } = req.body; // Destructuring the request body to get user data

    //Encrypt the password before saving it to the database

    const passwordhash = await bcrypt.hash(password, 10); // Hashing the password with a salt rounds of 10

    //Creating a new instance of the new user model
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordhash, // Storing the hashed password
    });

    await user.save(); //Saving the user to the database
    res.send("User created successfully");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).send("Internal Server Error " + err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); // Finding the user by email
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.vaidatePassword(password); // Comparing the provided password with the hashed password
    if (isPasswordValid) {
      //Create a JWT token
      const token = await user.getJWT(); // Using the method defined in the user model to get the JWT token

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      }); // Setting the token in a cookie with an expiration of 8 hours
      res.send("Login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Internal Server Error " + err.message);
  }
});

router.post("/logout",async(req,res)=>{
  try{
    res.cookie("token", null,{
      expires:new Date(Date.now()),
    })
    res.send("Logout successful"); // Sending a response back to the user indicating successful logout
  }catch(err){
    res.status(400).send("Internal Server Error " + err.message); // Sending an error response if something goes wrong
  }
})

module.exports = router; // Exporting the router to be used in the main app