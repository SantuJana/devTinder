const express = require('express');
const { validate } = require('../validations/registrationValidation');
const User = require('../models/user');

const authRouter = express.Router();

authRouter.post('/signup', validate, async (req, res) => {
    const {firstName, lastName, emailId, password} = req.body;

    const user = new User({
        firstName,
        lastName,
        emailId,
        password
    });

    try {
        await user.createHash();
        await user.save();
        res.json("Registration complete");
    } catch (error) {
        res.status(400).send(error.message);
    }
})

authRouter.post('/login', async (req, res) => {
    const {emailId, password} = req.body;

    try {
        const user = await User.findOne({emailId});
        if(!user){
            return res.status(400).send("User not found");
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).send("Invalid credentials");
        }

        const token = await user.generateAuthToken();
        res.cookie("token", token, {httpOnly: true, maxAge: 1 * 24 * 60 * 60 * 1000});
        res.json({message: "Successfully loggedin", data: user});
    } catch (error) {
        res.status(400).send(error.message);
    }
})

authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, {maxAge: 0});
    res.json("Logout successful");
})

module.exports = authRouter;