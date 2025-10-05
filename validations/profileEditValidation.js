const validator = require("validator");

const ALLOWED_FIELDS = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"]

exports.validate = (req, res, next) => {
    Object.keys(req.body).forEach(key => {
        if(!ALLOWED_FIELDS.includes(key)){
            return res.status(400).send("Invalid field : "+key);
        }
    })

    const { firstName, lastName, age, gender, photoUrl, about, skills } = req.body;

    if (!firstName || !lastName){
        return res.status(400).send("firstName and lastName are required");
    }

    if(firstName && (!validator.isLength(firstName, {min: 3, max: 50}) || !validator.isAlpha(firstName))){
        return res.status(400).send("Invalid firstName");
    }
    if(lastName && (!validator.isLength(lastName, {min: 3, max: 50}) || !validator.isAlpha(lastName))){
        return res.status(400).send("Invalid lastName");
    }
    if(age && (!validator.isInt(age.toString(), {min: 18, max: 100}))){
        return res.status(400).send("Invalid age");
    }
    if((gender && !['male', 'female', 'other'].includes(gender))){
        return res.status(400).send("Invalid gender");
    }
    if((photoUrl && !validator.isURL(photoUrl))){
        return res.status(400).send("Invalid photoUrl");
    }
    if(about && !validator.isLength(about, {max: 500})){
        return res.status(400).send("Invalid about");
    }
    if(skills && (!Array.isArray(skills) || skills.length > 10)){
        return res.status(400).send("Invalid skills");
    }

    next();
}