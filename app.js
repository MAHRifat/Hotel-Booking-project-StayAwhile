const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listings.js");
const review = require("./routes/review.js");

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
app.use(flash());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    res.locals.danger = req.flash("danger");
    next();
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/stayAwhile'); 
  }


main().then(()=> {
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});


app.use("/listings", listings);
app.use("/listings", review);


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
