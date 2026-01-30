require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const http = require("http");
const cors = require("cors"); // Importing cors for handling cross-origin requests
const cookieParser = require("cookie-parser"); // Importing cookie-parser for handling cookiess


require("./utils/cronjob");

// app.use(cors(
//   {
//     origin: "http://localhost:5173",
//     credentials: true,
//   }
// ));


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    //allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// handle preflight


app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

const authRouter = require("./routes/authRouter");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/userRouter");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/api", authRouter); // Using the auth router for authentication routes
app.use("/api", requestRouter); // Using the request router for connection requests
app.use("/api", profileRouter); // Using the profile router for user profile routes
app.use("/api", userRouter);
app.use("/api", paymentRouter);
app.use("/api", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
