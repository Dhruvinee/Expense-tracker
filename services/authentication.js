const JWT = require("jsonwebtoken");

const secret = "Dhruv$123";

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
    }
    const token = JWT.sign(payload,secret);
    
    return token;
}

function validateToken(token){
    try{
        const payload = JWT.verify(token,secret);
        return payload;
    }catch(error){
        console.log("Error!");
        return null;
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
}
