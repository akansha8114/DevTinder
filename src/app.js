const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user"); // Assuming you have a User model defined
const { ReturnDocument } = require("mongodb");
const validateSignupData = require("./utils/validation"); // Importing the validation function
const bcrypt = require("bcrypt"); // Importing bcrypt for password hashing
const cookieParser = require("cookie-parser"); // Importing cookie-parser for handling cookies
const jwt = require("jsonwebtoken"); // Importing jsonwebtoken for creating JWT tokens
const userAuth = require("./middleware/auth"); // Importing the authentication middleware

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

//Creating a psot Api key for signup
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile",userAuth, async (req, res) => {
  try {
    const user = req.user; // The user object is attached to the request by the userAuth middleware

    res.send(user); // Sending the user data back to the client
  } catch (err) {
    res.status(400).send("Error " + err.message); // Sending an error response if something goes wrong
  }
});

app.post("/sendconnectionrequest",userAuth,async(req,res)=>{  
  try{
    const user = req.user; // The user object is attached to the request by the userAuth middleware
    res.send(user.firstName + " Sent the Connection request  " );
  }catch(err){
    res.status(400).send("Error " + err.message); // Sending an error response if something goes wrong
  }
  
})

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error cannot connect the databse");
  });
