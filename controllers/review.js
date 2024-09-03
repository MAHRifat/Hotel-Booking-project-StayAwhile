const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postReviewForm = async (req , res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = req.user;
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("warning", "Review deleted");
    res.redirect(`/listings/${id}`);
};