const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js");

// signup User

router.get("/signup", userController.renderSignup);

// create user
router.post("/signup", wrapAsync(userController.createUser));

// signin

router.get("/signin", userController.renderSignin);


router.post("/signin", saveRedirectUrl, 
    passport.authenticate(
        "local", {
            failureRedirect: "/signin", 
            failureFlash: true}
        ),
    userController.userSignin);

// logout route

router.get("/signout", userController.userSignout);

module.exports = router;