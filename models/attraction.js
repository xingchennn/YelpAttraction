
var mongoose = require("mongoose");

var attractionSchema = new mongoose.Schema({
    name: String,
    image: String,
	cost: Number,
    description: String,
	location: String,
	lat: Number,
	lng: Number,
    author: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Attraction", attractionSchema);