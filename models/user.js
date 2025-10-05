const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 50,
        trim: true,
    },
    emailId: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email : "+value);
            }
        },
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    photoUrl: {
        type: String,
        default: "https://example.com/default-profile-photo.jpg",
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL : "+value);
            }
        }
    },
    about: {
        type: String,
        maxLength: 500,
        trim: true,
        default: "I am a devTinder user"
    },
    skills:{
        type: [String],
        default: []
    }
}, { timestamps: true })

userSchema.methods.createHash = async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAuthToken = async function(){
    return await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {expiresIn: "1d"});
}

const User = mongoose.model("User", userSchema);

module.exports = User;