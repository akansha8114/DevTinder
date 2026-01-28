const express = require("express");
const connectDB = require("./config/database");
const app = express();
const http = require("http");
const cookieParser = require("cookie-parser"); // Importing cookie-parser for handling cookiess
const cors = require("cors"); // Importing cors for handling cross-origin requests

require("dotenv").config();

require("./utils/cronjob");

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

const authRouter = require("./routes/authRouter");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/userRouter");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter); // Using the auth router for authentication routes
app.use("/", requestRouter); // Using the request router for connection requests
app.use("/", profileRouter); // Using the profile router for user profile routes
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
