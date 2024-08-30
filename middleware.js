module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.flash("danger", "you must be sign in");
        return res.redirect("/signin");
    }

    next();
}