//Importing Validator
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    //Checks if the chosen object is not equal to the isEmpty function but it if it has a value, it stays as the value,
    //If not, it gets replaced with ''.
    
    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if(Validator.isEmpty(data.title)) {
        errors.title = 'Job Title is Required!';
    }

    if(Validator.isEmpty(data.company)) {
        errors.company = "Company Name is Required";
    }

    if(Validator.isEmpty(data.from)) {
        errors.from = "Starting Date is Required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};