const express=require("express");
require("dotenv").config();//to sucure privacy
const app=express();//create a instant of express application
const userRouter=require("./routes/routes.js");
const cors = require("cors"); // Import the cors package

app.use(cors()); // Use the cors middleware to enable CORS
app.use(express.json()); //json->javascript obj
app.use("/api/users",userRouter);

const port=process.env.APP_PORT||3000;
// const port=5000;
app.listen(port,()=>{
    console.log("Server is running at port "+port);
})