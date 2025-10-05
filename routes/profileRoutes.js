const express = require('express');
const { authenticate } = require('../middlewares/authenticate');
const User = require('../models/user');
const { validate } = require('../validations/profileEditValidation');

const profileRouter = express.Router();

profileRouter.get('/profile/view', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("firstName lastName age gender about skills photoUrl");
        res.json({data: user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

profileRouter.post('/profile/edit', authenticate, validate, async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        Object.keys(req.body).forEach((key) => {
            req.body[key] && (user[key] = req.body[key]);
        })
        await user.save();
        res.json({data: user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = profileRouter;