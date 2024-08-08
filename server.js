const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from 'public' directory
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/reviews', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema and model for reviews
const reviewSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    reviewText: String,
    rating: Number
});

const Review = mongoose.model('Review', reviewSchema);

app.get('/api/reviews', async (req, res) => {
    const reviews = await Review.find();
    res.json(reviews);
});

let reviews = [];

// app.post('/api/reviews', (req, res) => {
//     const { firstName, lastName, reviewText, rating } = req.body;
//     if (!firstName || !lastName || !reviewText || !rating) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     const newReview = { firstName, lastName, reviewText, rating };
//     reviews.push(newReview);
//     res.json(newReview);
// });

app.post('/api/reviews', async (req, res) => {
    const { firstName, lastName, reviewText, rating } = req.body;
    const newReview = new Review({ firstName, lastName, reviewText, rating });
    await newReview.save();
    res.json(newReview);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
