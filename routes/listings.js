const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

    // validation function for create new route
    const validateListing = (req, res, next)=>{
        let result = listingSchema.validate(req.body);
        if(result.error){
            let erMsg = result.error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400, erMsg);
        }else{
            next();
        }
    }

// index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// new route
router.get("/new", (req, res)=> {
    res.render("listings/createForm.ejs");
});


// show route

router.get("/:id",wrapAsync(async (req, res)=> {
    const {id} = req.params;
    const listing =await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));


// create route

router.post("/", validateListing , wrapAsync( async (req, res,next)=> {
    const newListing = new Listing(req.body.listing);
    // schema validation -> but this is not the effecient way  -> so we use joi api 
    // if(!newListing.title){
    //     throw new ExpressError(400,"Title missing");
    // }
    req.flash("success", "New listing created");
    await newListing.save();
    res.redirect("/listings");
    
}));




// edit route
 
router.get("/:id/edit",wrapAsync(async (req,res)=> {
    const {id} = req.params;
    const listing =await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit.ejs", {listing});
}));

// update route
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    const {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   req.flash("danger", "Listing updated");
   res.redirect(`/listings/${id}`);
}));


// delete route

router.delete("/:id",wrapAsync(async (req, res)=> {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("warning", "Listing deleted");
    res.redirect("/listings");
}));


module.exports = router;