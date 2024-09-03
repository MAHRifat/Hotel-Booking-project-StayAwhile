const Listing = require("./models/listing");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;     // store the url after go signin page
        req.flash("danger", "you must be sign in");
        return res.redirect("/signin");
    }

    next();
};


module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};


// middleware for authorizations
module.exports.isOwner = async (req, res, next) => {
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to do");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


// validation middleware for create new route
module.exports.validateListing = (req, res, next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        let erMsg = result.error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, erMsg);
    }else{
        next();
    }
};

// validation middleware for review
module.exports.validateReview = (req, res, next)=>{
    let result = reviewSchema.validate(req.body);
    if(result.error){
        let erMsg = result.error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, erMsg);
    }else{
        next();
    }
}