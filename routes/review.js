const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");
// Review model 


// review form
router.post("/:id/reviews",isLoggedIn,validateReview, wrapAsync(reviewController.postReviewForm));

// delete review
    // Mongo $pull operator
        // the $pull operator removes from an existing arry all instances of a value
        // or values that match a specified condition.

router.delete("/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;