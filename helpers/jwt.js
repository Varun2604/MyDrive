const jwt = require("jsonwebtoken");
const config = require("../config");
const jwtKey = config.jwt.secret_token;
const jwtExpirySeconds = config.jwt.expiry_seconds;

module.exports = class JWTHelper{
    static Generate(user_name, password) {
        return new Promise(async (resolve, reject) => {
                try{
                // Create a new token with the username in the payload
                const token = jwt.sign({ user_name, password }, jwtKey, {
                    algorithm: "HS256",
                    expiresIn: jwtExpirySeconds,
                });
                resolve(token);
            }catch(e){
                reject(e);
            }
        })
    }
    static Verify (token) {
        return new Promise((resolve, reject) => {
           try{
               resolve(jwt.verify(token, jwtKey));
           }catch(e){
               reject(e);
           }
        });
    }
};
