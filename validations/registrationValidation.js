const validator = require("validator");

const ALLOWED_FIELDS = ["firstName", "lastName", "emailId", "password"];

exports.validate = (req, res, next) => {
    Object.keys(req.body).forEach(key => {
        if(!ALLOWED_FIELDS.includes(key)){
            return res.status(400).send("Invalid field : "+key);
        }
    })

    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName || !emailId || !password){
        return res.status(400).send("All fields are required");
    }
    if(!validator.isLength(validator.trim(firstName), {min: 3, max: 50})){
        return res.status(400).send("First name must be between 3 and 50 characters");
    }
    if(!validator.isLength(validator.trim(lastName), {min: 3, max: 50})){
        return res.status(400).send("Last name must be between 3 and 50 characters");
    }
    if(!validator.isEmail(validator.trim(emailId))){
        return res.status(400).send("Invalid email : "+emailId);
    }
    if(!validator.isStrongPassword(validator.trim(password))){
        return res.status(400).send("Password is not strong enough");
    }
    if(!validator.isLength(validator.trim(password), {min: 8})){
        return res.status(400).send("Password must be at least 8 characters long");
    }
    next();  
}