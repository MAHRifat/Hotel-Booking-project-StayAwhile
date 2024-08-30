module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.flash("danger", "you must be sign in to create listing");
        return res.redirect("/signin");
    }

    next();
}