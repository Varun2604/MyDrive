const { genSaltSync: genSalt, hashSync : hashPassword} = require('bcrypt');
const {DbHandler} = require("../helpers");

class UserRepo{
    constructor(){
        this.collection_name = "users"
    }
    Create(name, user_name, password, type){
        let self = this;
        return new Promise((resolve, reject)=>{
            const salt = genSalt();
            let user = {
                password : hashPassword(password, salt),
                salt : salt,
                name : name,
                user_name : user_name,
                type : type
            };
            DbHandler.Insert(self.collection_name, user).then((result)=>{
                resolve(result);
            }, (err)=>{
                console.error("Error while creating user", err);
                //TODO check error and return case specific error, for eg - unique idx check error
                reject(new Error("Unable to create user"));
            }).catch((err)=>{
                console.error("Error while creating user", err);
                reject(new Error("Unable to create user"));
            });
        });
    }
    ValidateUser(user_name, password){
        let self = this;
        return new Promise((resolve, reject)=>{
            self.Get(null, user_name).then((user)=>{
                if(user !== null && user.hasOwnProperty("password")){
                    if(hashPassword(password, user.salt) === user.password){
                        resolve(user);
                        return;
                    }else{
                        reject(new Error("Invalid password"));
                        return;
                    }
                }
                reject(new Error("Invalid user_name"));
            }, (err)=>{
                console.error("unable to fetch user while validating with error", err);
            });
        });
    }
    Update(){

    }
    Delete(){

    }
    Get(id=null, user_name=null){
        let self = this;
        return new Promise((resolve, reject)=>{
            if(id === null && user_name === null){
                reject(new Error("invalid input"));
                return;
            }
            let search_val = {};
            if(id !== null){
                search_val.id = id;
            }
            if(user_name !== null){
                search_val.user_name = user_name;
            }
            return DbHandler.Find(self.collection_name, search_val).then((user)=>{
                resolve(user[0]);
            }, (err)=>{
                console.error("Error while getting user", err);
                reject(err)
            }).catch((err)=>{
                console.error("Error while getting user", err);
                reject(err)
            })
        });
    }
}

module.exports = new UserRepo();
