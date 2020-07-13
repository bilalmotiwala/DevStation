//Importing Validator
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};

    //Checks if the chosen object is not equal to the isEmpty function but it if it has a value, it stays as the value,
    //If not, it gets replaced with ''.
    
    data.text = !isEmpty(data.text) ? data.text : '';

    if(!Validator.isLength(data.text, {min: 5, max: 350})) {
        errors.text = "Post must exceed 5 characters but not more than 350 characters."
    }
    
    if(Validator.isEmpty(data.text)) {
        errors.text = "It can't be Posted if it's Empty!";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};