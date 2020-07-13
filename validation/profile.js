//Importing Validator
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
    let errors = {};

    //Checks if the chosen object is not equal to the isEmpty function but it if it has a value, it stays as the value,
    //If not, it gets replaced with ''.
    
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';
   
    if(!Validator.isLength(data.handle, {min: 2, max: 40})) {
        errors.handle = "Handle needs to be between 2 and 40 characters.";
    }

    if(Validator.isEmpty(data.handle)) {
        errors.handle = "A Profile Handle is required";
    } 

    if(Validator.isEmpty(data.status)) {
        errors.status = "Status Field is Required.";
    }

    if(Validator.isEmpty(data.skills)) {
        errors.skills = "Skills Field is Required.";
    }

    if(!isEmpty(data.website)) {
        if(!Validator.isURL(data.website)) {
            errors.website = "Please Enter a Valid URL!";
        }
    }

    if(!isEmpty(data.facebook)) {
        if(!Validator.isURL(data.facebook)) {
            errors.facebook = "Please Enter a Valid URL to your Facebook Profile!";
        }
    }

    if(!isEmpty(data.twitter)) {
        if(!Validator.isURL(data.twitter)) {
            errors.twitter = "Please Enter a Valid URL to your Twitter Profile!";
        }
    }

    if(!isEmpty(data.linkedin)) {
        if(!Validator.isURL(data.linkedin)) {
            errors.linkedin = "Please Enter a Valid URL to your LinkedIn Profile!";
        }
    }

    if(!isEmpty(data.instagram)) {
        if(!Validator.isURL(data.instagram)) {
            errors.instagram = "Please Enter a Valid URL to your Instagram Profile!";
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};