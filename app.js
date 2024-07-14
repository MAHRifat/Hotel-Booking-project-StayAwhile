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
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const listings = require("./routes/listings.js");

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





app.use("/listings", listings);




// Review model 

     // validation function for review
        const validateReview = (req, res, next)=>{
            let result = reviewSchema.validate(req.body);
            if(result.error){
                let erMsg = result.error.details.map((el)=> el.message).join(",");
                throw new ExpressError(400, erMsg);
            }else{
                next();
            }
        }

    // review form
    app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req , res)=>{
        const {id} = req.params;
        let listing = await Listing.findById(id);
        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        console.log("data saved");
        // res.send("saved");
        res.redirect(`/listings/${id}`);
    }));

    // delete review
        // Mongo $pull operator
            // the $pull operator removes from an existing arry all instances of a value
            // or values that match a specified condition.

    app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res)=>{
        let {id, reviewId} = req.params;
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
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
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
});


// validations for schema -> we use joi api




    
app.listen(8000, ()=> {
    console.log("server is listening to port 8000");
});
