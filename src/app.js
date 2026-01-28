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
));
// app.use(cors(
//   {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // allow PATCH explicitly
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }
// )); // Enabling CORS for all routes
// app.options("*", cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

const authRouter = require("./routes/authRouter");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/userRouter");

app.use("/", authRouter); // Using the auth router for authentication routes
app.use("/", requestRouter); // Using the request router for connection requests
app.use("/", profileRouter); // Using the profile router for user profile routes
app.use("/", userRouter);

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
