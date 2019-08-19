var express = require("express");
var router = express.Router();
var Attraction = require("../models/attraction");
var middleware = require("../middleware");

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Attraction.find({}, function(err, allAttractions){
       if(err){
           console.log(err);
       } else {
          res.render("attractions/index",{attractions: allAttractions, page: 'attractions'});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('nope', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newAttraction = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Attraction.create(newAttraction, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/attractions");
        }
    });
  });
});

router.get("/new", middleware.isLoggedIn, function(req,res) {
    res.render("attractions/new.ejs");
});

router.get("/:id", function(req, res) {
    Attraction.findById(req.params.id).populate("comments").exec(function(err, foundAttraction) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundAttraction);
            res.render("attractions/show", {attraction: foundAttraction});
        }
    });
});

router.get("/:id/edit", middleware.checkAttractionOwnership, function(req, res){
	Attraction.findById(req.params.id, function(err, foundAttraction){
		res.render("attractions/edit", {attraction: foundAttraction});	
	});
});



// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkAttractionOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('nope', 'Invalid address');
      return res.redirect('back');
    }
    req.body.attraction.lat = data[0].latitude;
    req.body.attraction.lng = data[0].longitude;
    req.body.attraction.location = data[0].formattedAddress;

    Attraction.findByIdAndUpdate(req.params.id, req.body.attraction, function(err, attraction){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/attractions/" + attraction._id);
        }
    });
  });
});

router.delete("/:id", middleware.checkAttractionOwnership, function(req,res) {
    Attraction.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/attractions");
        } else {
            res.redirect("/attractions");
        }
    });
});

module.exports = router;