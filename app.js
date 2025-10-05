require("dotenv").config();
const express = require("express");
const { connectToDb } = require("./config/dbconnection");
const User = require("./models/user");
const authRouter = require("./routes/autheRouter");
const profileRouter = require("./routes/profileRoutes");
const cookieParser = require("cookie-parser");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectToDb()
.then(() => {
    app.listen(7777, () => {
        console.log("Server is running on port 7777");
    })
})
.catch((err) => {
    console.error("Failed to start server as database connection not established");
})