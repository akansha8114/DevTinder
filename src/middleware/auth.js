//This file is part of the middleware for authentication in the DevTinder application.
//It wwill handle user authentication and authorization for all API except the signup and login APIs.
const jwt = require("jsonwebtoken"); // Importing jsonwebtoken for creating and verifying tokens
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //Read the token from the request cookies
    const cookies = req.cookies; // Accessing cookies from the request object
    const { token } = cookies; // Extracting the token from cookies
    if (!token) {
      return res.status(401).send("Please login !!"); // If no token is found, throw an error
    }

    const decodedObj =  jwt.verify(token, process.env.JWT_SECRET);
    //const decodeOBJ = jwt.verify(token, "DEVTINDER"); // Verifying the token with the secret key
    const { _id } = decodedObj; // Extracting the user ID from the decoded token
    const user = await User.findById(_id); // Finding the user by ID
    if (!user) {
      throw new Error("User not found"); // If user is not found, throw an error
    }
    //console.log("Incoming cookies: ", req.cookies);
    req.user = user; // Attaching the user object to the request for further use
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = {
  userAuth,
}; // Exporting the middleware function for use in other files
