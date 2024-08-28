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
        let {username, email, password} = req.body.signup;
        const newUser = new User({email, username});
        const nUser = await User.register(newUser, password);
        req.flash("success", "Welcome to StayAwhile!");
        console.log(nUser);
        res.redirect("/listings");
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

module.exports = router;