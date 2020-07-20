const jwt = require("jsonwebtoken");
const {ErrorHandler, JWTAuth} = require("../../helpers");
const {User} = require('../../services');

module.exports = function(white_listed_url_regexes) {


    return (req, res, next) =>{

        // skip white listed urls, these will be public urls and auth checks will not be required.
        if(white_listed_url_regexes != null && white_listed_url_regexes.length > 0){
            let path = req.path;
            for(let reg of white_listed_url_regexes){
                let m = path.match(reg);
                if(m != null && m.length > 0){
                    return next();
               }
            }
        }
        // Session token can be obtained from the cookies, sess tokens are set for the requests from UI client
        let token = req.cookies.token;

        // if the cookie is not set, check for `Authorisation` Header,
        // since  the requests coming from API clients will have Authorisation Headers set
        if (!token) {
            token = req.header('Authorization');
        }

        // if the token is not set, return an unauthorized error
        if (!token) {
            return ErrorHandler.Unauthorised(res);
        }

        (async () => {
            try {
                //This method will throw an error
                // if the token is invalid (if it has expired according to the expiry time we set on sign in),
                // or if the signature does not match
                let payload  = await JWTAuth.Verify(token);

                //verify teh user with the input jwt token.
                let user = await User.ValidateUser(payload.user_name, payload.password);
                if(user === null) {
                    return ErrorHandler.BadRequest(res, "Invalid username or password");
                }
                delete user.password;           //TODO is using the delete keyword an optimal way to delete keys from an object (search) ??
                delete user.salt;
                req.user = user;
                next();
            } catch (e) {
                if (e instanceof jwt.JsonWebTokenError) {
                    // if the error thrown is because the JWT is unauthorized, return a 401 error
                    return ErrorHandler.Unauthorised(res);
                }else if(e.message.indexOf("Invalid") === 0){             //TODO handle expiry error as well.
                    return ErrorHandler.BadRequest(res, e.message);
                }else
                // else, return a internal server error
                    console.error("Error while validating user ", e);
                return ErrorHandler.InternalServerError(res);
            }
        })();
    }
};
