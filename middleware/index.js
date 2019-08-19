var Attraction = require("../models/attraction");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkAttractionOwnership = function(req,res,next) {
	if(req.isAuthenticated()){
        Attraction.findById(req.params.id, function(err, foundAttraction){
           if(err){
			   req.flash("nope","Attraction not found.")
               res.redirect("back");
           }  else {
            if(foundAttraction.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("nope","You do not have permission to do that.")
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req,res,next) {
	if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
			   req.flash("nope","Comment not found.")
               res.redirect("back");
           }  else {
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("nope","You do not have permission to do that.")
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("nope","Please login first.")
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req,res,next) {
	if (req.isAuthenticated()) {
        return next();
    }
	req.flash("nope", "Please login first.");
    res.redirect("/login");
};


module.exports = middlewareObj;