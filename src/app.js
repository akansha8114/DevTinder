const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user"); // Assuming you have a User model defined
const { ReturnDocument } = require("mongodb");
const validateSignupData = require("./utils/validation"); // Importing the validation function
const bcrypt = require("bcrypt"); // Importing bcrypt for password hashing
const cookieParser = require("cookie-parser"); // Importing cookie-parser for handling cookies
const jwt = require("jsonwebtoken"); // Importing jsonwebtoken for creating JWT tokens

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
    const isPasswordValid = await bcrypt.compare(password, user.password); // Comparing the provided password with the hashed password
    if (isPasswordValid) {
      //Create a JWT token
      const token = await jwt.sign({_id: user._id},"DEVTINDER@" ); // Signing the token with a secret key
      console.log(token);

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token);
      res.send("Login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Internal Server Error " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies; // Accessing cookies from the request object
    const { token } = cookies; // Extracting the token from cookies

    if(!token){
      throw new Error("invalid token");     //if the token is not there/present.
    } 

    //Valiadte the token here
    const decodedmessage = await jwt.verify(token, "DEVTINDER@"); // Verifying the token with the secret key
    const { _id } = decodedmessage; // Extracting the user ID from the decoded message
    console.log("logged in user id : " + _id); // Logging the decoded message for debugging
    const user = await User.findById(_id); // Finding the user by ID
    if(!user){
      throw new Error("User not present");  //User not present . Login again.
    }

    res.send(user); // Sending the user data back to the client
  } catch (err) {
    res.status(400).send("Error " + err.message); // Sending an error response if something goes wrong
  }
});

//Try to find a user by email : Using a get API
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.find({ email: userEmail });
    res.send(user);
  } catch (err) {
    res.status(400).send("User not found");
  }
});

//Feed API to get all users on the feed of the user app to swipe left or right
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}); //This will return all users in the database
    res.send(users);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

//Deleting a user by ID
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});

//Updating data of a user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId; // Extracting userId dynamically from the request parameters
  const updateData = req.body; // Assuming updateData contains the fields to be updated
  try {
    const ALLOWED_UPDATES = ["photourl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(updateData).every(
      (
        k // Checking if the keys we are updatingis allowed to be updated or not
      ) => ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new error("Update not allowed");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, updateData, {
      runValidators: true, // This option ensures that the validators are run on the updated fields
    });

    res.send("User updated successfully");
  } catch (err) {
    res.status(500).send("Error updating user " + err.message);
  }
});

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
