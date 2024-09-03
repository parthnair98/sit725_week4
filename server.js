const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http'); // Import http module
const socketIo = require('socket.io'); // Import socket.io

const app = express();
const port = 3000;

// Create an HTTP server and attach the Express app to it
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = socketIo(server);

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
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

app.post('/api/reviews', async (req, res) => {
    const { firstName, lastName, reviewText, rating } = req.body;
    try {
        const newReview = new Review({ firstName, lastName, reviewText, rating });
        await newReview.save();
        res.json(newReview);
    } catch (error) {
        res.status(500).json({ error: 'Error saving review' });
    }
});

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('a user connected');
    
    // Generate and send a random number to the client
    const randomNumber = Math.floor(Math.random() * 10);
    console.log(`sent number: ${randomNumber}`);
    socket.emit('randomNumber', randomNumber);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Use the HTTP server to listen for connections
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
