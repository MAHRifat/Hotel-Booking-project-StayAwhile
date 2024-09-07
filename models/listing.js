const mongoose = require("mongoose");
const Review = require("./review");
const { ref } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: [
            "camping",
            "arctic",
            "amazing views",
            "rooms",
            "desert",
            "lake",
            "tropical",
            "golfing",
            "trending",
            "farms",
        ],
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

