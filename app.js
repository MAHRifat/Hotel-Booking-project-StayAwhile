if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,    //  expire now to 3 days
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    },
};

app.get("/", (req, res)=> {
    res.send("Root direactory");
});


app.use(session(sessionOptions));
// to use passport we must use sesssion, initialize and sessionoptions
app.use(passport.initialize());    // a middleware that initializes passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    res.locals.danger = req.flash("danger");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser",async (req, res)=>{
    let fackUser = new User({
        email: "fuck@gmail.com",
        username: "fuck",
    });

    let newUser = await User.register(fackUser, "fucku");
    res.send(newUser);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/stayAwhile'); 
  }


main().then(()=> {
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});


app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);
app.use("/",userRouter);



// form validations
    /* When we enter data in the form, the browser
     and/or the web server will check to see that
     the data is in the correct format and within 
     the constraints set by the application. */

// custom error handler

app.all("*",(req, res, next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err, req, res, next)=> {
    let {statusCode=500, message="Somethings went wrong!"}= err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
});


// validations for schema -> we use joi api


app.listen(8000, ()=> {
    console.log("server is listening to port 8000");
});
