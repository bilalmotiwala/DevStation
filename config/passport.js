//Importing JWTStrategy
const JWTStrategy = require('passport-jwt').Strategy;

//Importing ExtractJwt
const ExtractJWT = require('passport-jwt').ExtractJwt;

//Importing Mongoose
const mongoose = require('mongoose');

//Importing Model(s)
const User = mongoose.model('users');

//Importing Key(s)
const keys = require('../config/keys');
const { ExtractJwt } = require('passport-jwt');

//Setting up Options
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
    passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if(user){
                    //Authenticate and Allow Access if User ID found and matched.
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch(err => console.log(err));
        })
    );
};