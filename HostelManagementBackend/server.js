const express = require('express');
const app = express();
const mongoose =require('mongoose');
const dotenv=require('dotenv');
// const authRoute =require("./backend/routers/auth");
// const postRoute= require("./backend/routers/posts");
// const getRoute= require("./backend/routers/receive");
// const roomRoute= require("./backend/routers/room");
// const sproblem=require("./backend/routers/sproblem");

//dotenv for the .env file
dotenv.config();

//middleware
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

// //import auth middleware
// app.use('/api/user',authRoute);
// //import posts middleware
// app.use('/api/posts',postRoute);
// //import receive middleware
// app.use('/api/receive',getRoute);
// //middleware for choosing the room
// app.use('/api/room',roomRoute);
// //middleware for the problem
// app.use('/api/pro',sproblem);

mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true,useUnifiedTopology: true},
()=> console.log("connected to db"));

app.listen(process.env.PORT,()=>{
    console.log(`listning at port ${process.env.PORT}`);
})


