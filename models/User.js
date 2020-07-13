//Importing Mongoose
const mongoose = require('mongoose');

//Importing the Schema
const Schema = mongoose.Schema;

//Creating the Schema. The schema shall have an object based structure.
//Hence, we use the JSON format to create the structure for all objects we will work with and their properties.
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    },

});

//Exporting the Model
module.exports = User = mongoose.model('users', UserSchema);