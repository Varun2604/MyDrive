const jwt = require("jsonwebtoken");
const config = require("../../config");
const {ErrorHandler, MongoHandler} = require("../../helpers");
const {User} = require("../../repositories");
const jwtKey = config.jwt.secret_token;

module.exports = function(req, res, next) {
    //TODO skip whitelisted urls like /users or Get /assets

    // Session token can be obtained from the cookies, sess tokens are set for the requests from UI client
    var token = req.cookies.token;

    // if the cookie is not set, check for `Authorisation` Header,
    // since  the requests coming from API clients will have Authorisation Headers set
    if (!token) {
        token = req.header('Authorisation');
    }

    // if the token is not set, return an unauthorized error
    if (!token) {
        return ErrorHandler.Unauthorised(res);
    }

    try {
        //This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        let payload = jwt.verify(token, jwtKey);
        User.ValidateUser(payload.user_name, payload.password).then((user)=>{
            if(user === null) {
                return ErrorHandler.Unauthorised(res);
            }
            req.user = user;
            next();
        }, (e)=>{
            if(e.message.indexOf("Invalid") === 0){             //TODO handle expiry error as well.
                return ErrorHandler.BadRequest(res, e.message)
            }
        });
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return ErrorHandler.Unauthorised(res);
        }else
        // else, return a internal server error
        console.error("Error while validating user ", e);
        return ErrorHandler.InternalServerError(res);
    }
};
