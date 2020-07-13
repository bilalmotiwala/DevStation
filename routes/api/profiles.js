//Importing Express
const express = require('express');

//Creating the Router
const router = express.Router();

//Importing Mongoose
const mongoose = require('mongoose');

//Importing Passport
const passport = require('passport');

//Importing our Models and Loading them.
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//Loading Validation
const validateProfileInput = require('../../validation/profile');

//Creating various Routes

//@Route:           GET api/profiles/test
//@Description:     Tests the Profiles Route
//@Access Type:     Public
router.get('/test', (req, res) => res.json({message: "Profiles API Works!"}));

//@Route:           GET api/profile
//@Description:     Get the Profile for the Current User.
//@Access Type:     Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    const errors = {};
    
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = "User Profile Doesn't Exist";
                return res.status(404).json(errors)
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

//@Route:           GET api/profile/handle/:handle
//@Description:     Visit any Profile by Handle
//@Access Type:     Private
router.get('/handle/:handle', passport.authenticate('jwt', {session:false}), (req, res) => {
    Profile.findOne({ handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = "No Profile Exists at the current handle.";
                return res.status(404).json(errors);
            } else {
                res.json(profile);
            }
        })
        .catch(err => res.status(404).json(err));
})

//@Route:           GET api/profile/user/:user_id
//@Description:     Visit any Profile by User ID (Not SEO Friendly)
//@Access Type:     Public
router.get('/user/:user_id', (req, res) => {
    Profile.findOne({ user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = "No Profile Exists at the current User ID.";
                return res.status(404).json(errors);
            } else {
                res.json(profile);
            }
        })
        .catch(err => res.status(404).json(err));
})


//@Route:           POST api/profile
//@Description:     Create or Update Profile of the Logged In User.
//@Access Type:     Private
router.post(
    '/',
    passport.authenticate('jwt', {session: false}), 
    (req, res) => {

        const { errors, isValid } = validateProfileInput(req.body);

        //Check Validation
        if(!isValid) {
            //If not Valid, then return errors.
            return res.status(400).json(errors);
        }
    
        //Fetching the fields for our entire profile
        const profileFields = {};
        profileFields.user = req.user.id;

        if(req.body.handle) profileFields.handle = req.body.handle;
        if(req.body.company) profileFields.company = req.body.company;
        if(req.body.website) profileFields.website = req.body.website;
        if(req.body.location) profileFields.location = req.body.location;
        if(req.body.status) profileFields.status = req.body.status;
        if(req.body.bio) profileFields.bio = req.body.bio;
        if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

        //Special Structure for Skills as it was an array split by using commas (CSV structure).
        if(typeof req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }

        //Structure for the Social Links
        profileFields.social = {};
        if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if(req.body.instagram) profileFields.social.facebook = req.body.instagram;
        if(req.body.linkedin) profileFields.social.facebook = req.body.linkedin;
        if(req.body.twitter) profileFields.social.facebook = req.body.twitter;

        //Toggle to Create or Update Profile Depending on the Situation
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                if(profile) {
                    //Update if exists
                    Profile.findOneAndUpdate(
                        { user: req.user.id }, 
                        { $set: profileFields }, 
                        { new: true }
                    ).then(profile => res.json(profile));
                } else {
                    //Create if doesn't exist.
                    //Checking if Profile Handle exists.
                    Profile.findOne({ handle: profileFields.handle }).then(profileFields => {
                        if(profile) {
                            errors.handle = "That handle already exists.";
                            res.status(400).json(errors);
                        }
                            //If Valid, then Saving the profile.
                            new Profile(profileFields).save().then(profile => res.json(profile));
                        });
                    }
           })
           .catch(err => res.status(400).json(err))   ;     
        }
    );

//Exporting the router for our Server
module.exports = router;