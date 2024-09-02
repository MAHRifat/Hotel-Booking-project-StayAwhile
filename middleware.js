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