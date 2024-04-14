const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    originalTitle: String,
    director: String,
    years: Number,
    country: String,
    time: String,
    gender: String,
    synopsis: String
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
