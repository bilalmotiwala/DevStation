//Importing Validator
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    //Checks if the chosen object is not equal to the isEmpty function but it if it has a value, it stays as the value,
    //If not, it gets replaced with ''.
    
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(!Validator.isEmail(data.email)) {
        errors.email = "Invalid Email! Recheck and try again.";
    }
    
    if(Validator.isEmpty(data.email)) {
        errors.email = "Email is Required!";
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = "Password is Required!";
    }  

    return {
        errors,
        isValid: isEmpty(errors)
    }
};