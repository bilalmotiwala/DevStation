//Importing Validator
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    //Checks if the chosen object is not equal to the isEmpty function but it if it has a value, it stays as the value,
    //If not, it gets replaced with ''.
    
    data.institution = !isEmpty(data.institution) ? data.institution : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';


    if(Validator.isEmpty(data.institution)) {
        errors.institution = 'Institute name is Required!';
    }

    if(Validator.isEmpty(data.degree)) {
        errors.degree = "Degree Type is Required!";
    }

    if(Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = "Field Of Study is Required!";
    }

    if(Validator.isEmpty(data.from)) {
        errors.from = "Starting Date is Required!";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};