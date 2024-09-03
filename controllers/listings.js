const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
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
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
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
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    const {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   req.flash("success", "Listing updated");
   res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res)=> {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("warning", "Listing deleted");
    res.redirect("/listings");
};