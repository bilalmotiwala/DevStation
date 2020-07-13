//Importing Express
const express = require('express');

//Importing Gravatar
const gravatar = require('gravatar');

//Importing BCrypt
const bcrypt = require('bcryptjs');

//Importing JSONWebtoken
const jwt = require('jsonwebtoken');

//Importing Keys
const keys = require('../../config/keys');

//Importing Passport to Create Private Routes.
const passport = require('passport');

//Loading Input Validation.
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Loading the User Model.
const User = require('../../models/User');
const {route} = require('./profiles');

//Creating the Router
const router = express.Router();

//Creating various Routes

//@Route:           GET api/users/test
//@Description:     Tests the Users Route
//@Access Type:     Public
router.get('/test', (req, res) => res.json({message: "Users API Works!"}));

//@Route:           POST api/users/register
//@Description:     Allows to Register a new User
//@Access Type:     Public
router.post('/register', (req, res) => {
    
    //Initialzing the Validation Check
    const {errors, isValid} = validateRegisterInput(req.body);

    //Checking the Validation Output
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })                                     //Loads in the email from the data in the email object from the body of the User Model.
        .then(user => {                                                         //Data loaded in as a user, we can use promises to make a condition of it.
            if(user) {
                errors.email = 'Email Already Associated to an existing User!'
                return res.status(400).json({errors})   //If user exists (email found), return a 400 - Validation error and give output saying "Email Already Exists!"
            } else {
                const avatar = gravatar.url( req.body.email, {                  //Getting avatar from Gravatar into Avatar variable.
                    s: '200',                                                   //Size of the Avatar.
                    r: 'r',                                                      //Rating for the allowed type of avatars.
                    d: 'mm'                                                     //Default Avatar is a custom avatar isnt found.
                });
                
                const newUser = new User({                                      //ELSE - Create a New User
                    name: req.body.name,                                        //Load in name from the name identifier in the body of the generated POST request.
                    email: req.body.email,                                      //Load in email from the email identifier in the body of the generated POST request.
                    avatar: avatar,                                             //Load in avatar from the email avatar in the body of the generated POST request.
                    password: req.body.password                                 //Load in password from the password identifier in the body of the generated POST request.
                });

                bcrypt.genSalt(12, (err, salt) => {                             //Generate the salt(key) for the encryption with given length
                    bcrypt.hash(newUser.password, salt, (err, hash) => {        //Hash the Password Field from our newUser object
                        if(err) throw err;                                      //If error, throw error.
                        newUser.password = hash;                                //Replace Password with the Hashed Password
                        newUser.save()                                          //Save this using Mongoose .save() method
                            .then(user => res.json(user))                       //Send the entire user as a response in JSON format
                            .catch(err => console.log(err));                    //Check for Errors and console log them if error.
                    });
                })
            }
        });
});

//@Route:           POST api/users/login
//@Description:     Allows existing users to Login
//@Access Type:     Public
router.post('/login', (req, res) => {
    
        //Initialzing the Validation Check
        const {errors, isValid} = validateLoginInput(req.body);

        //Checking the Validation Output
        if(!isValid) {
            return res.status(400).json(errors);
        }

    const email = req.body.email;
    const password = req.body.password;
    
    //Finding the User by Email.
    User.findOne({email})                                                       //Check via User's email.
        .then(user => {                                                         
            //Checking if the email exists in the database.
            if(!user) {
                errors.email = 'User Not Found!'
                return res.status(404).json(errors);
            }
            
            //Checking if the Password matches to the saved password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        //Considering the User has matched, we create a payload for signing the token.
                        const payload = { 
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };
                        
                        //Signing the Token.
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: "14h" }, 
                            (err, token) => {
                                res.json({
                                    success : true,
                                    token : "Bearer " + token
                                });
                            }
                        );
                    } else {
                        errors.password = 'Incorrect Password! Please re-check and try again!';
                        res.status(400).json(errors);
                    }
                });
        });
});

//@Route:           GET api/users/current
//@Description:     Return Current User Based on the Token submitted
//@Access Type:     Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id : req.user.id,
        name : req.user.name,
        email: req.user.email,
        avatar : req.user.avatar
    });
});


//Exporting the router for our Server
module.exports = router;