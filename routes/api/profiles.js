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
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');


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
            }
            
            res.json(profile);
        })
        .catch(err => res.status(404).json({ profile: "No Profile Exists at the current handle." }));
})

//@Route:           GET api/profile/handle/:handle
//@Description:     Visit any Profile by Handle
//@Access Type:     Private
router.get('/all', passport.authenticate('jwt', {session:false}), (req, res) => {
    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
        if(!profiles) {
            errors.noprofile = "No Profile Exists at the current handle.";
            return res.status(404).json(errors);
        }

        res.json(profiles);
    })
    .catch(err => res.status(404).json({profiles: "There are no Profiles to Display at the Moment!"}));
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
        .catch(err => res.status(404).json({ profile: "No Profile found at specified User ID!" }));
})


//@Route:           POST api/profile
//@Description:     Create or Update Profile of the Logged In User.
//@Access Type:     Private
router.post(
    "/",
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
        if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
        if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if(req.body.twitter) profileFields.social.twitter = req.body.twitter;

        //Toggle to Create or Update Profile Depending on the Situation
        Profile.findOne({ user: req.user.id }).then(profile => {
			if (profile) {
				//Update the existing profile
				Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				).then(profile => res.json(profile));
			} else {
				//Create a profile

				//Check  if handle exists
				Profile.findOne({ handle: profileFields.handle }).then(profile => {
					if (profile) {
						errors.handle = "That handle already exists";
						res.status(400).json(errors);
					}

					new Profile(profileFields).save().then(profile => res.json(profile));
                });
            }
       }); 
    }
);

//@Route:           POST api/profile/experience
//@Description:     Add or Update your Work Experience
//@Access Type:     Private
router.post(
    "/experience",
    passport.authenticate('jwt', {session: false}), 
    (req, res) => {

        const { errors, isValid } = validateExperienceInput(req.body);
        //Check Validation
        if(!isValid) {
            //If not Valid, then return errors.
            return res.status(400).json(errors);
        }

        Profile.findOne({ user: req.user.id})
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            //Adding it to the Work Experience Array in our Profile.
            profile.experience.unshift(newExp);
            //Saving Profile
            profile.save().then(profile => res.json(profile));
        })
});

//@Route:           POST api/profile/education
//@Description:     Add or Update your Educational Information
//@Access Type:     Private
router.post(
    '/education',
    passport.authenticate('jwt', {session:false}),
    (req, res) => {

        const { errors, isValid } = validateEducationInput(req.body);
        //Check Validation
        if(!isValid) {
            //If not Valid, then return errors.
            return res.status(400).json(errors);
        }

        Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                institution: req.body.institution,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            //Adding it to the Educational Information Array in our Profile.
            profile.education.unshift(newEdu);
            //Saivng Profile
            profile.save().then(profile => res.json(profile));
        })
    }
);

//@Route:           DELETE api/profile/experience/:exp_id
//@Description:     Delete your Work Experience Information
//@Access Type:     Private
router.delete(
    '/experience/:exp_id',
    passport.authenticate('jwt', {session:false}),
    (req, res) => {

        Profile.findOne({ user: req.user.id })
        .then(profile => {

            //Geting the Remove Index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);

            //Splice and Remove from the Experience Array
            profile.experience.splice(removeIndex, 1);

            //Saving these changes
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
);

//@Route:           DELETE api/profile/education/:edu_id
//@Description:     Delete your Education Information
//@Access Type:     Private
router.delete(
    '/education/:edu_id',
    passport.authenticate('jwt', {session:false}),
    (req, res) => {

        Profile.findOne({ user: req.user.id })
        .then(profile => {

            //Geting the Remove Index
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);

            //Splice and Remove from the Experience Array
            profile.education.splice(removeIndex, 1);

            //Saving these changes
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
);

//@Route:           DELETE api/profile
//@Description:     Delete User and Profile
//@Access Type:     Private
router.delete(
    '/',
    passport.authenticate('jwt', {session:false}),
    (req, res) => {

        Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id })
                .then(() => 
                res.json({message: "User and Corresponding Profile has been deleted!"})
                );
        });
    }
);

//Exporting the router for our Server
module.exports = router;