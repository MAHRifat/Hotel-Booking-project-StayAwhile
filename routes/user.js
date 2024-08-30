const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");


// signup User

router.get("/signup",(req, res)=>{
    res.render("registration/signup.ejs");
});

// create user
router.post("/signup", wrapAsync( async (req, res,next)=> {
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
}));

// signin

router.get("/signin",(req, res)=>{
    res.render("registration/signin.ejs");
});


router.post("/signin", passport.authenticate("local", {failureRedirect: "/signin", failureFlash: true}),
async(req, res)=> {
    req.flash("success","Welcome back to StayAwhile! you are successfully signin");
    res.redirect("/listings");
});

// logout route

router.get("/signout", async(req, res, next)=>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        
        req.flash("warning", "Sign you out!");
        res.redirect("/signin");
    });
});

module.exports = router;