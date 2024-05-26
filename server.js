
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRouter = require('./routes/users');
const propertyRoutes = require('./routes/propertyRoutes');
const likesRoutes = require('./routes/likeRoutes');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.static("./frontend/build"));
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"rentify-frontend","build","index.html"));
})
// Routes
app.use('/api/users', usersRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api', propertyRoutes);
app.use('/api/likes', likesRoutes);


// MongoDB Atlas connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { /* No options here */ })
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Rentify API');
});




// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});


