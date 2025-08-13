const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user'); // Assuming you have a User model defined

app.use(express.json()); // Middleware to parse JSON bodies

//Creating a psot Api key for signup
app.post("/signup", async (req,res)=>{
    //Creating a new instance of the new user model
    const user = new User(req.body);  //req.body returns the JS object which contains the user data from the request body
    try{
        await user.save();   //Saving the user to the database
        res.send("User created successfully");
    }catch(err){
        console.error("Error creating user:", err);
        res.status(500).send("Internal Server Error");
    }
    
});


connectDB()
  .then(() =>{
    console.log("Database connected successfully");
    app.listen(3000,()=>{
        console.log("Server is running on port 3000");
    })
  })
    .catch((err) => {
        console.error("Error cannot connect the databse");
    });

