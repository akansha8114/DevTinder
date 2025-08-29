const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user"); // Assuming you have a User model defined
const { ReturnDocument } = require("mongodb");
const cookieParser = require("cookie-parser"); // Importing cookie-parser for handling cookiess
const cors = require("cors"); // Importing cors for handling cross-origin requests

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
)); // Enabling CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

const authrouter = require("./routes/authRouter");
const requestRouter = require("./routes/request");
const profilerouter = require("./routes/profile");
const userRouter = require("./routes/userRouter");

app.use("/", authrouter); // Using the auth router for authentication routes
app.use("/", requestRouter); // Using the request router for connection requests
app.use("/", profilerouter); // Using the profile router for user profile routes
app.use("/",userRouter);

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
