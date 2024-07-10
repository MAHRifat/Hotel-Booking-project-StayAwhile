const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const exp = require("constants");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



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

// app.get("/listing",(req, res)=> {
//     let sampleListing = new Listing({
//         title: "My Sea",
//         description: "My beach",
//         price: 343,
//         location: "Cox's Bazar",
//         country: "Bangalesh",
//     });

//     sampleListing.save().then(listing => {
//         console.log("Listing save", listing);
//     }).catch(err => console.log(err));

//     console.log("sample was saved");
//     res.send("successful");
// });

// index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// create new route

app.get("/listings/new", (req, res)=> {
    res.render("listings/createForm.ejs");
});

app.post("/listings",wrapAsync( async (req, res,next)=> {
        // const {title} = req.body;
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    // console.log(req.body.listing);
    const newListing = new Listing(req.body.listing);
    // console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
    
}));

// show route

app.get("/listings/:id",wrapAsync(async (req, res)=> {
    const {id} = req.params;
    const listing =await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));


// edit route
 
app.get("/listings/:id/edit",wrapAsync(async (req,res)=> {
    const {id} = req.params;
    const listing =await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit.ejs", {listing});
}));

// update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    const {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listings/${id}`);
}));


// delete route

app.delete("/listings/:id",wrapAsync(async (req, res)=> {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));



// form validations
    /* When we enter data in the form, the browser
     and/or the web server will check to see that
     the data is in the correct format and within 
     the constraints set by the application. */

// custom error handler

app.all("*",(req, res, next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err, req, res, next)=> {
    let {statusCode=500, message="Somethings went wrong!"}= err;
    res.status(statusCode).send(message);
});

    
app.listen(8000, ()=> {
    console.log("server is listening to port 8000");
});
