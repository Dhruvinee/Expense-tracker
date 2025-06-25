const { validateToken } = require("../service/authentication");

function checkForAuthenticationCookie(cookieName){
    return (req,res,next) => {
        const tokenValue = req.cookies[cookieName];
        if(!tokenValue){
            return next();
        }
        try{
            const userPayload = validateToken(tokenValue);
            //res.locals.user = userPayload;
            req.user = userPayload;
            res.locals.user = userPayload;
        }catch(error){
            console.log("Error from me!");
        }

        next();
    }
}

module.exports = {
    checkForAuthenticationCookie,
}