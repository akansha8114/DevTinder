const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user"); // Assuming you have a User model defined
const { ReturnDocument } = require("mongodb");
const cookieParser = require("cookie-parser"); // Importing cookie-parser for handling cookiess

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

const authrouter = require("./routes/authRouter");
const requestRouter = require("./routes/request");
const profilerouter = require("./routes/profile");

app.use("/", authrouter); // Using the auth router for authentication routes
app.use("/", requestRouter); // Using the request router for connection requests
app.use("/", profilerouter); // Using the profile router for user profile routes

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
