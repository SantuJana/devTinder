const express = require("express");
const { authenticate } = require("../middlewares/authenticate");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

const userRouter = express.Router();

const ALLOWED_FIELDS = ["firstName", "lastName", "age", "gender", "about", "skills", "photoUrl"];

userRouter.get("/user/requests", authenticate, async (req, res) => {
    try {
        const loggedInUser = req.user;
        let requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ALLOWED_FIELDS);

        requests = requests.map((request) => request.fromUserId);

        res.json({data: requests});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.get("/user/connections", authenticate, async (req, res) => {
    try {
        const loggedInUser = req.user;
        let connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ],
        }).populate("fromUserId", ALLOWED_FIELDS).populate("toUserId", ALLOWED_FIELDS);

        connections = connections.map((connection) => {
            if (connection.fromUserId._id.toString() === loggedInUser._id.toString()){
                return connection.toUserId;
            }
            return connection.fromUserId;
        });

        res.json({data: connections});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

userRouter.get("/user/feed", authenticate, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(50, parseInt(req.query.limit) || 10);

        let connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ],
        }).select("fromUserId toUserId");

        const hideUserIds = new Set();

        hideUserIds.add(loggedInUser._id.toString());

        connections.map(connection => {
            hideUserIds.add(connection.fromUserId.toString());
            hideUserIds.add(connection.toUserId.toString());
        })

        const feed = await User.find({
            _id: { $nin: Array.from(hideUserIds) },
        }).select(ALLOWED_FIELDS).skip((page - 1)*limit).limit(limit);

        res.json({data: feed});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

module.exports = userRouter;