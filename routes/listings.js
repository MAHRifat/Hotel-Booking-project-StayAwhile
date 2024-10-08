const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {validateListing,isLoggedIn,isOwner} = require("../middleware.js");

// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
// NOTE: Multer will not process any form which is not multipart (multipart/form-data).
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listings.js");

// router.route() apply for same path route

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn, 
        upload.single('listing[image]'), 
        validateListing ,
        wrapAsync(listingController.createListing)
    );

// new route

router.get("/new",isLoggedIn, listingController.renderNewForm);
router.get('/search', listingController.searchListings);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing)
    );


// edit route

router.get("/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.editListing)
);

// router.get('/searchForm', listingController.renderSearchForm);




// index route
// router.get("/",wrapAsync(listingController.index));

// show route
// router.get("/:id",wrapAsync(listingController.showListing));


// create route
// router.post("/", isLoggedIn, validateListing , wrapAsync(listingController.createListing));

// update route
// router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));


// delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


module.exports = router;