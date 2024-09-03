const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js");

// router.route() use for the same path stay togather

router
    .route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.createUser));

// signup User
// router.get("/signup", userController.renderSignup);

// create user
// router.post("/signup", wrapAsync(userController.createUser));



router
    .route("/signin")
    .get(userController.renderSignin)
    .post(saveRedirectUrl, 
        passport.authenticate(
            "local", {
                failureRedirect: "/signin", 
                failureFlash: true}
            ),
        userController.userSignin
    );

// signin
// router.get("/signin", userController.renderSignin);

// router.post("/signin", saveRedirectUrl, 
//     passport.authenticate(
//         "local", {
//             failureRedirect: "/signin", 
//             failureFlash: true}
//         ),
//     userController.userSignin);

// logout route

router.get("/signout", userController.userSignout);

module.exports = router;