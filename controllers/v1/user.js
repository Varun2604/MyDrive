const jwt = require("jsonwebtoken");

const {ErrorHandler, Utils} = require("../../helpers");
const config = require("../../config");
const {User} = require("../../services");

const jwtKey = config.jwt.secret_token;
const jwtExpirySeconds = config.jwt.expiry_seconds;

class UserController {
    create(req, res) {
        let user = req.body;
        let non_keys = Utils.CheckMandatoryFields(user, ["name", "user_name", "password"]);
        if(non_keys.length !== 0){
            return ErrorHandler.MandatoryFieldBadRequest(res, non_keys);
        }
        (async()=>{
            try{
                let result = await User.Create(user.name, user.user_name, user.password, user.type || "basic");
                console.log(result); //remove
                let u = result.ops[0];
                delete u.password;
                delete u.salt;
                return res.status(200).json({
                    message: "successfully created user",
                    details : u
                });
            }catch(e){
                if(e.message.indexOf("duplicate key") !== -1){
                    return ErrorHandler.BadRequest(res, "user_name already present");
                }else{
                    console.error("Error while creating user", e);
                    return ErrorHandler.InternalServerError(res);
                }
            }
        })();
    }

    generateToken(req, res) {
        // get basic auth creds from header.
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            return ErrorHandler.Unauthorised(res);
        }
        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [user_name, password] = credentials.split(':');

        if (!user_name || !password) {
            // return 401 error is username or password doesn't exist, or if password does
            return ErrorHandler.Unauthorised(res);
        }

        (async () =>{
            try{
                await User.ValidateUser(user_name, password);
                // Create a new token with the username in the payload
                const token = jwt.sign({ user_name, password }, jwtKey, {
                    algorithm: "HS256",
                    expiresIn: jwtExpirySeconds,
                });

                // set the cookie as the token string, with a similar max age as the token
                // here, the max age is in milliseconds, so we multiply by 1000
                res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
                //set in the response, for API usage.
                return res.status(200).json({
                    message : "token generated successfully",
                    details : {token}
                });
            }catch(e){
                if(e.message.indexOf("Invalid") === 0){
                    return ErrorHandler.Unauthorised(res, e.message);
                }
                console.error("Error while generating token for user : ", e);
                return ErrorHandler.InternalServerError(res);
            }

        })();
    }

    update(req, res){
        return res.status(200).json({
            message: "update user",
        });
    }

    delete(req, res){
        return res.status(200).json({
            message: "delete user",
        });
    }

    get(req, res){
        return res.status(200).json({
            message: "get users",
        });
    }
}

module.exports = new UserController();
