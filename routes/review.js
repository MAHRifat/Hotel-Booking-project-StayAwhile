const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

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
router.post("/:id/reviews",validateReview, wrapAsync(async (req , res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("data saved");
    req.flash("success", "New review created");
    // res.send("saved");
    res.redirect(`/listings/${id}`);
}));

// delete review
    // Mongo $pull operator
        // the $pull operator removes from an existing arry all instances of a value
        // or values that match a specified condition.

router.delete("/:id/reviews/:reviewId", wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("warning", "Review deleted");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;