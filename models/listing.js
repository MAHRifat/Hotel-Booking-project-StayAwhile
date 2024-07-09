const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: {
        default: "https://unsplash.com/photos/two-people-in-scuba-gear-swimming-in-the-ocean-SuGTwrtPCg4",
        type: String,
        set: (v)=> v===""? "https://unsplash.com/photos/two-people-in-scuba-gear-swimming-in-the-ocean-SuGTwrtPCg4" : v,
    },
    price: Number,
    location: String,
    country: String,
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

