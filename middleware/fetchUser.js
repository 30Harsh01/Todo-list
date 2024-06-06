const jwt = require('jsonwebtoken');
const User = require('../src/models/UserSchema');
const JWT_SECRET = 'harshwebsite';  // This should be kept secret and ideally stored in environment variables

const fetchUser = async (req, res, next) => {
    // Get the user from jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const decode = jwt.verify(token, JWT_SECRET);
        console.log(decode);
        console.log("user: " + decode.user);
        console.log("id: " + decode.user._id);
        
        if (!decode || !decode.user || !decode.user._id) {
            return res.status(401).json({ error: "Invalid token" }); 
        }
        
        const user = await User.findById(decode.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });  //error message response to return
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send({ error: "Please authenticate using a valid token" }); 
    }
};

module.exports = fetchUser;
