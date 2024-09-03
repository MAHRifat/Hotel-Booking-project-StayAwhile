const User = require("../models/user.js");

module.exports.renderSignup = (req, res)=>{
    res.render("registration/signup.ejs");
};

module.exports.createUser = async (req, res,next)=> {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const nUser = await User.register(newUser, password);
       
        // login after signup automatically
       
        req.login(nUser, (err) => {
            if(err) {
                next(err);
            }
        
            req.flash("success","Welcome to StayAwhile");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("warning", err.message);
        res.redirect("/signup");
    }   
};


module.exports.renderSignin = (req, res)=>{
    res.render("registration/signin.ejs");
};

module.exports.userSignin = async(req, res)=> {
    req.flash("success","Welcome back to StayAwhile! you are successfully signin");
    let redirectUrl = res.locals.redirectUrl || "listings";
    res.redirect(redirectUrl);
};

module.exports.userSignout = async(req, res, next)=>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        
        req.flash("warning", "Sign you out!");
        res.redirect("/signin");
    });
};