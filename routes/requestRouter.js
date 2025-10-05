const express = require("express");
const { authenticate } = require("../middlewares/authenticate");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", authenticate, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const fromUserId = loggedInUser._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const ALLOWED_STATUS = ["interested", "ignored"];

        if (!ALLOWED_STATUS.includes(status)){
            return res.status(400).send({message: "Status not valid"});
        }

        if (toUserId === fromUserId){
            return res.status(400).send({message: "Cannot send request to self"});
        }

        const existUser = await User.findById(toUserId);

        if (!existUser){
            return res.status(400).send({message: "User not found"});
        }

        const existingConnection = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnection){
            return res.status(400).send({message: "Connection already exists"});
        }
    
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
    
        const data = await connectionRequest.save();
    
        res.json({ message: "Connection request sent successfully", data });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", authenticate, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const ALLOWED_STATUS = ["accepted", "rejected"];
        if (!ALLOWED_STATUS.includes(status)){
            return res.status(400).send({message: "Status not valid"});
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });
        if (!connectionRequest){
            return res.status(400).send({message: "Connection request not found"});
        }
        connectionRequest.status = status;
        await connectionRequest.save();
        res.json({ message: "Connection request reviewed successfully", data: connectionRequest });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

module.exports = requestRouter;