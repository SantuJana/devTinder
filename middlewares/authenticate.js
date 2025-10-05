const jwt = require('jsonwebtoken');
exports.authenticate = async (req, res, next) => {
    const { token } = req.cookies;
    
    if(!token){
        return res.status(401).send("Unauthorized");
    }
    try{
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).send("Unauthorized");
    }
}