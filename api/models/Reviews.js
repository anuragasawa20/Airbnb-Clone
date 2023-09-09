const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    placeId: { type: String, required: true },
    content: { type: String, required: true },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;