const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    originalTitle: { type: String, index: true }, 
    director: String,
    years: Number,
    country: String,
    time: String,
    gender: String,
    synopsis: String,
    Titre: { type: String, index: true } 
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
