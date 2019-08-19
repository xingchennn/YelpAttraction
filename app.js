var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
	flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Attraction = require("./models/attraction"),
    Comment = require("./models/comment"),
    User = require("./models/user");
 //   seedBD = require("./seeds");
    
var commentRoutes = require("./routes/comments");
var attractionRoutes = require("./routes/attractions");
var indexRoutes = require("./routes/index");

app.use(require("express-session")({
    secret: "ONCE AGAIN",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
    
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedBD();

app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
	res.locals.nope = req.flash("nope");
	res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/attractions", attractionRoutes);
app.use("/attractions/:id/comments", commentRoutes);



app.listen(3000, process.env.IP, function() {
    console.log("started");
});

