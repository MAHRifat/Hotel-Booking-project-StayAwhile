const Listing = require("../models/listing");
const LocationCountry = require('../models/search');

module.exports.index = async (req,res)=>{
    const {category} = req.query;
    const query = category ? {category} : {};
    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res)=> {
    console.log(req.user);
    res.render("listings/createForm.ejs");
};

module.exports.showListing = async (req, res)=> {
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
};

module.exports.createListing = async (req, res,next)=> {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();

    // Check if location-country pair exists
    const { location, country } = req.body.listing;
    const existingPair = await LocationCountry.findOne({ location, country });

    // If not, add the new location-country pair to the dropdown
    if (!existingPair) {
        const newLocationCountry = new LocationCountry({ location, country });
        await newLocationCountry.save();
    }

    req.flash("success", "New listing created");
    res.redirect("/listings");
    
};

module.exports.editListing = async (req,res)=> {
    const {id} = req.params;
    const listing =await Listing.findById(id);
    if(!listing){
        req.flash("danger", "The listing you trying to edit not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    const {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof(req.file) !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    } 
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res)=> {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("warning", "Listing deleted");
    res.redirect("/listings");
};


module.exports.searchListings = async (req, res) => {
    const { locationCountry } = req.query;
    console.log(locationCountry);
    const [location, country] = locationCountry.split('|'); // Split the location and country from the dropdown
    // Search for listings based on location and country
    const listings = await Listing.find({ location, country });
    if (!listings || listings.length === 0) {
        req.flash('error', 'No listings found for the selected location and country.');
        return res.redirect('/listings');
    }
    // Render the search results
    res.render('listings/searchResults', { listings });
};
