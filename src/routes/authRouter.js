const express = require("express");
const router = express.Router();
const { validateSignupData } = require("../utils/validation"); // Importing the validation function
const bcrypt = require("bcrypt"); // Importing bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Importing jsonwebtoken for creating JWT tokens

const User = require("../models/user"); // Assuming you have a User model defined

router.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignupData(req); // This will throw an error if validation fails
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      photourl,
      about,
      skills,
      age,
    } = req.body; // Destructuring the request body to get user data

    //Encrypt the password before saving it to the database

    const passwordhash = await bcrypt.hash(password, 10); // Hashing the password with a salt rounds of 10

    //Creating a new instance of the new user model
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordhash, // Storing the hashed password
      gender,
      photourl,
      about,
      skills,
      age,
    });

     const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // Finding the user by email
    if (!user) {
      return res.status(401).send("Please login!!! User not found");
    }
    const isPasswordValid = await user.validatePassword(password); // Comparing the provided password with the hashed password
    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    }
      //Create a JWT token
      const token = await user.getJWT(); // Using the method defined in the user model to get the JWT token

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        
        expires: new Date(Date.now() + 8 * 3600000),
      }); // Setting the token in a cookie with an expiration of 8 hours
      res.json(user);
    
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout successful"); // Sending a response back to the user indicating successful logout
  } catch (err) {
    res.status(400).send("Internal Server Error " + err.message); // Sending an error response if something goes wrong
  }
});

module.exports = router; // Exporting the router to be used in the main app
