//This is used to import Express.js
const express = require('express');

//Initialzing Express.js
const app = express();

//Importing all routes
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');

//This is used to import Mongoose
const mongoose = require('mongoose');

//Importing the MongoDB Configuration File
const db = require('./config/keys').mongoURI;

//Connecting to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log(err));


//Making a Request.
app.get('/', (req, res) => res.send('Hello World!'));

//Utilizing Routes
app.use('/api/users', users);
app.use('/api/profile', profiles);
app.use('/api/posts', posts);

//Setting up ports that it's either Heroku's enivronment port or local port 5000.
const port = process.env.PORT || 5000;
//Listening to Port and logging the status
app.listen(port, () => console.log(`Server Running On Port ${port}`));