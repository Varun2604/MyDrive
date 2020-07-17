const {DbHandler} = require("../helpers");
const AssetService = require('./Asset');
const {StorageHandler, Utils} = require("../helpers");

class FileRepo{
    constructor(){
        this.collection_name = "files";
    }

    Create(name=null, is_public=false, asset=null){
        let self = this;
        return new Promise(async (resolve, reject)=>{
            let file = {
                name : name,
                is_public : is_public,
                asset : asset
            };

            try{
                let non_keys = Utils.CheckMandatoryFields(file, ["asset", "is_public"]);
                if(non_keys.length !== 0){
                    return reject(new Error(`Mandatory fields [ ${non_keys} ] unavailable`));
                }else if(file.asset.id == null){
                    return reject(new Error(`Invalid value for asset`));
                }

                //fetch the asset details
                let asset = await AssetService.Get(file.asset.id);
                if(asset == null){
                    return reject(new Error(`Invalid asset in input`));
                }
                //move the move the asset to approved folder
                await StorageHandler.copyFromTmpToApproved(asset.system_file_name, asset.system_file_name);
                if(file.name == null){
                    file.name = asset.actual_name;
                }
                if(StorageHandler.getExtension(file.name) === ''){
                    file.name = file.name+"."+StorageHandler.fetchExtensionFor(asset.mime_type);
                }
                file.system_file_name = asset.system_file_name;
                file.size = asset.size;
                file.encoding = asset.encoding;
                file.mime_type = asset.mime_type;
                file.created = Date.now();

                //insert file details into db.
                let result = await DbHandler.Insert(self.collection_name, file);

                //delete temporary assets
                await AssetService.Delete(asset._id);
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

    }
    Get(id){

    }
}

module.exports = new FileRepo();
