//Importing Express
const express = require('express');

//Creating the Router
const router = express.Router();

//Importing Mongoose.
const mongoose = require('mongoose');

//Importing Passport.
const passport = require('passport');

//Importing the Post Model
const Post = require("../../models/Post");

//Importing the Profile Model
const Profile = require('../../models/Profile');

//Importing Post Validations
const validatePostInput = require("../../validation/post");
const { route } = require('./profiles');

//Creating various Routes

//@Route:           GET api/posts/test
//@Description:     Tests the Posts Route
//@Access Type:     Public
router.get('/test', (req, res) => res.json({message: "Posts API Works!"}));

//@Route:           GET api/posts
//@Description:     Fetches all posts to be seen (Timeline Concept)
//@Access Type:     Private
router.get(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Post.find()
            .sort({date: -1})
            .then(posts => res.json(posts))
            .catch(err => res.status(404).json({message: "No Posts Available to Show!"}));
    }
)

//@Route:           GET api/posts/:post_id
//@Description:     Fetches a single post by ID.
//@Access Type:     Private
router.get(
    '/:post_id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Post.findById(req.params.post_id)
            .then(post => res.json(post))
            .catch(err => res.status(404).json({message: "There's No Post at the current Post ID!"}));
    }
)


//@Route:           POST api/posts/
//@Description:     Allows Creation of Posts
//@Access Type:     Private
router.post(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {

        const { errors, isValid } = validatePostInput(req.body);

        //Check Validation
        if(!isValid) {
            //If not Valid, then return errors.
            return res.status(400).json(errors);
        }

        //Collecting the Data for the POST.
        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        });
        
        //Saving the New Post
        newPost.save().then(post => res.json(post));
    });

//@Route:           DELETE api/posts/:post_id
//@Description:     Allows Deletion of Posts
//@Access Type:     Private
router.delete(
    '/:post_id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {

        Profile.findOne({ user: req.user.id})
        .then(profile => {
            Post.findById(req.params.post_id)
            .then(post => {

                //Check if request if from Post Author.
                if(post.user.toString() !== req.user.id) {
                    return res.status(401).json({message: "User Not Authorized!"})
                }

                //Deleting the post
                post.remove().then(() => res.json({message: "Successfully Deleted Post!"}));
            })
        })
        .catch(err => res.status(404).json({error: "Post Not Found!"}));
    });

//@Route:           POST api/posts/like/:post_id
//@Description:     Allows You to Like a Post.
//@Access Type:     Private
router.post(
    '/like/:post_id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {

        Profile.findOne({ user: req.user.id})
        .then(profile => {
            Post.findById(req.params.post_id)
            .then(post => {

                //Checking if User has already liked the post.
                if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                    return res.status(400).json({ message: "User Already Has Liked this Post!"})
                }

                //Adding Likes.
                post.likes.unshift({ user: req.user.id })

                //Saving the Likes.
                post.save().then(post => res.json(post));
            })
        })
        .catch(err => res.status(404).json({error: "Post Not Found!"}));
    });

//@Route:           POST api/posts/unlike/:post_id
//@Description:     Allows You to Unlike a Post.
//@Access Type:     Private
router.post(
    '/unlike/:post_id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {

        Profile.findOne({ user: req.user.id})
        .then(profile => {
            Post.findById(req.params.post_id)
            .then(post => {

                //Checking if User has already liked the post.
                if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                    return res.status(400).json({ message: "User Cannot Unlike a Post which they haven't Liked first!"})
                }

                //Getting our RemoveIndex.
                const removeIndex = post.likes
                    .map(item => item.user.toString())
                    .indexOf(req.user.id);

                //Splice the user out of the likes array
                post.likes.splice(removeIndex, 1);

                //Saving the changes
                post.save().then(post => res.json(post));
            })
        })
        .catch(err => res.status(404).json({error: "Post Not Found!"}));
    });

//@Route:           POST api/posts/comment/:post_id
//@Description:     Allows You to comment on a Post.
//@Access Type:     Private
router.post(
    '/comment/:post_id',
    passport.authenticate('jwt', {session:false}),
    (req, res) => {

        const { errors, isValid } = validatePostInput(req.body);

        //Check Validation (Post can be used for comments as it uses the same structure and parameters!)
        if(!isValid) {
            //If not Valid, then return errors.
            return res.status(400).json(errors);
        }

    Post.findById(req.params.post_id)
            .then(post => {
                
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user.id
                }

                //Adding the comments to the post.
                post.comments.unshift(newComment);

                //Saving the Post.
                post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({message : "No Post Found!"}));
    }
);

//@Route:           DELETE api/posts/comment/:post_id/:comment_id
//@Description:     Allows you to delete your comment on a Post.
//@Access Type:     Private
router.delete(
    '/comment/:post_id/:comment_id',
    passport.authenticate('jwt', {session:false}),
    (req, res) => {

            Post.findById(req.params.post_id)
                .then(post => {
                
                //Check if the comment actually exists
                if(post.comments.filter(comment => 
                    comment._id.toString() === req.params.comment_id).length === 0) {
                        //The above logic dictates that the comment doesn't exist.
                        return res.status(404).json({message: "The Comment you're trying to delete doesn't exist!"})
                }
                //Setting up RemoveIndex to delete a comment
                const removeIndex = post.comments
                    .map(item => item._id.toString())
                    .indexOf(req.params.comment_id);

                //Splicing it out of the post comments
                post.comments.splice(removeIndex, 1);

                //Saving the changes.
                post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({message : "No Post Found!"}));
    }
);

//Exporting the router for our Server
module.exports = router;