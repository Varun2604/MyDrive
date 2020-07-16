
var env = process.env.NODE_ENV;
if(env !== "qa" && env !== "prod"){
    env = "dev"
}
module.exports = require("./"+env+"_config.json");
