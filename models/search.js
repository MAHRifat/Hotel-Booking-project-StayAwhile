const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationCountrySchema = new Schema({
    location: {
        type: String,
        required: true,
        unique: true // Ensures that location-country pairs are unique
    },
    country: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('LocationCountry', locationCountrySchema);
