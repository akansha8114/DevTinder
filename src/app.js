const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user'); // Assuming you have a User model defined
const { ReturnDocument } = require('mongodb');

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
        res.status(400).send("Internal Server Error");
    }
    
});

//Try to find a user by email : Using a get API
app.get("/user", async(req,res)=>{
    const userEmail = req.body.email;
    try{
        const user = await User.find({email : userEmail});
        res.send(user);
    }catch(err){
        res.status(400).send("User not found");
    }

});

//Feed API to get all users on the feed of the user app to swipe left or right
app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({});  //This will return all users in the database
        res.send(users);
    }catch(err){
        res.status(500).send("Error fetching users");
    }
});

//Deleting a user by ID
app.delete("/user", async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(500).send("Error deleting user");
    }
});

//Updating data of a user
app.patch("/user", async(req,res)=>{
    const userId = req.body.userId;
    const updateData = req.body; // Assuming updateData contains the fields to be updated
    try{
        const user = await User.findByIdAndUpdate({_id:userId}, updateData, {
            runValidators:true ,// This option ensures that the validators are run on the updated fields
        });
        res.send("User updated successfully");
    }catch(err){
        res.status(500).send("Error updating user "+ err.message );
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

