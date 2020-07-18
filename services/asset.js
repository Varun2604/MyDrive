const {DbHandler, Utils} = require("../helpers");

class AssetRepo{
    constructor(){
        this.collection_name = "assets";
    }

    Create(actual_name=null, system_file_name=null, encoding=null, mime_type=null, size=null, user=null){
        let self = this;
        return new Promise(async (resolve, reject)=>{

            let asset = {
                system_file_name : system_file_name,
                actual_name : actual_name,
                encoding : encoding,
                mime_type : mime_type,
                size : size,
                created : Date.now()
            };
            let non_keys = Utils.CheckMandatoryFields(asset,  ['actual_name', 'system_file_name', 'encoding', 'mime_type', 'size', 'created']);
            if(non_keys.length !== 0){
                return reject(new Error(`Mandatory fields [ ${non_keys} ] not present`));
            }
            try{
                asset.created_by = user
                let result = await DbHandler.Insert(self.collection_name, asset);
                resolve(result);
            }catch(e){
                console.error("Error while creating file", e);        //TODO do type checks on errors.
                reject(new Error("Unable to create file"));
            }
        });
    }
    Update(id, name){

    }
    Delete(id){
        let self = this;
        return new Promise((resolve, reject)=>{
            if(id == null){
                return reject(new Error("invalid id"));
            }
            return DbHandler.DeleteById(self.collection_name, id).then((d)=>{
                resolve(true);
            }, (err)=>{
                console.error("Error while deleting asset by id, ", err);
                reject(err)
            }).catch((err)=>{
                console.error("Error while deleting asset by id, ", err);
                reject(err)
            })
        });
    }
    Get(id){
        let self = this;
        return new Promise((resolve, reject)=>{
            if(id == null){
                return reject(new Error("invalid id"));
            }
            return DbHandler.Find(self.collection_name, {'_id' : DbHandler.ObjectIDOf(id)}).then((assets)=>{
                resolve(assets[0]);
            }, (err)=>{
                console.error("Error while getting asset, ", err);
                reject(err)
            }).catch((err)=>{
                console.error("Error while getting asset, ", err);
                reject(err)
            })
        });
    }
}

module.exports = new AssetRepo();
