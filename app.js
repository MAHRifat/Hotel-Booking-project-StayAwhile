const express = require("express");
const app = express();

const mongoose = require("mongoose");

app.listen(8000, ()=> {
    console.log("server is listening to port 8000");
});

app.get("/", (req, res)=> {
    res.send("Root direactory");
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/stayAwhile'); 
  }


main().then(()=> {
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});