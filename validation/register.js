//Importing Validator
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    //Checks if the chosen object is not equal to the isEmpty function but it if it has a value, it stays as the value,
    //If not, it gets replaced with ''.
    
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if(!Validator.isLength(data.name, { min: 2, max: 50 })){
        errors.name = "Name must be atleast 2 and at max 50 characters long.";
    }

    if(Validator.isEmpty(data.name)) {
        errors.name = "A Name is Required. I'm sure you're called something :)";
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = "No email? No Registeration!";
    }

    if(!Validator.isEmail(data.email)) {
        errors.email = "Invalid Email! Please try again.";
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = "The Password can't be empty. So think of one ...";
    }    

    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = "That's too short! Your Password needs to be atleast 6 characters.";
    }

    if(Validator.isEmpty(data.password2)) {
        errors.password2 = "What's a Password Confirmation if it's empty?";
    }
    
    if(!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords don't match! Could you try again?";
    }    

    return {
        errors,
        isValid: isEmpty(errors)
    }
};