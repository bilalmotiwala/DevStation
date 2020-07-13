//Importing Mongoose
const mongoose = require('mongoose');

//Importing the Schema
const Schema = mongoose.Schema;

//Creating our Profile Schema
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    text: {
        type: String,
        required: true
    },

    name: {
        type: String,
    },

    avatar: {
        type: String
    },

    likes : [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
        }
    ],

    comments : [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },

            text: {
                type: String,
                required: true
            },

            name: {
                type: String
            },

            avatar: {
                type: String,
            },

            date: {
                type: Date,
                default: Date.now
            }
        }
    ],

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);