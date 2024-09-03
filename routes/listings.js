const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {validateListing,isLoggedIn,isOwner} = require("../middleware.js");


// index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// new route
router.get("/new",isLoggedIn, (req, res)=> {
    // console.log(req.session);
    // console.log("User Authenticated:", req.isAuthenticated());
    console.log(req.user);
    res.render("listings/createForm.ejs");
});


// show route

router.get("/:id",wrapAsync(async (req, res)=> {
    const {id} = req.params;
    const listing =await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate: {
            path: "author"
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("danger", "The listing you trying to visit not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));


// create route

router.post("/", isLoggedIn, validateListing , wrapAsync( async (req, res,next)=> {
    const newListing = new Listing(req.body.listing);
    // schema validation -> but this is not the effecient way  -> so we use joi api 
    // if(!newListing.title){
    //     throw new ExpressError(400,"Title missing");
    // }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
    
}));




// edit route
 
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req,res)=> {
    const {id} = req.params;
    const listing =await Listing.findById(id);
    console.log(listing);
    if(!listing){
        req.flash("danger", "The listing you trying to edit not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

// update route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    const {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   req.flash("danger", "Listing updated");
   res.redirect(`/listings/${id}`);
}));


// delete route

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req, res)=> {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("warning", "Listing deleted");
    res.redirect("/listings");
}));


module.exports = router;