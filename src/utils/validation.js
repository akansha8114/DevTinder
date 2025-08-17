const validator = require('validator');

const validateSignupData = (req) => {
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName ) {
        throw new Error('First name and last name are required');
    }
    else if(!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong enough');
    }
    return true;
};

const validateEditProfileData = (req) => {
  try {
    const allowedEditFields = [
      "firstName",
      "lastName",
      "photourl",
      "about",
      "age",
      "gender",
    ];
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditFields.includes(field)
    ); // Checking if all fields in the request body are allowed for editing
    return isEditAllowed;
  } catch (err) {
    throw new Error("Error in validating edit profile data: " + err.message);
  }
};

module.exports = { validateSignupData, validateEditProfileData };