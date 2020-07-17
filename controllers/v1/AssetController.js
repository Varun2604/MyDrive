const Busboy = require('busboy');
const { v4: uuidv4 } = require('uuid');

const {ErrorHandler, FileHandler} = require("../../helpers");
const {Asset} = require('../../repositories');

class AssetController {
    static create(req, res) {
        const self = this;
        try{
            let busboy = new Busboy({ headers: req.headers });
            let system_file_name = uuidv4();
            let created_asset = false;
            busboy.on('file', async function(field_name, file, filename, encoding, mime_type) {
                if(!created_asset){
                    created_asset = true;
                    let splits = filename.split('.');
                    system_file_name = system_file_name + "." +splits[splits.length -1];
                    try{
                        // save file to system
                        await FileHandler.saveTmpAs(file, system_file_name);
                        // create an asset entry to db.
                        let result = await Asset.Create(filename, system_file_name, encoding, mime_type, 0);            //deletmine size
                        //return success
                        return res.status(200).json({
                            message: "asset stored temporarily, link to a file before 7 days",
                            asset_id : result.insertedId
                        });
                    }catch (e){
                        if(e.message.indexOf('Unsupported content type') !== -1){
                            await FileHandler.deleteTmp(system_file_name, false);
                            return ErrorHandler.InvalidValueBadRequest(res, ['file']);
                        }else{
                            console.log("error while writing temp file to system, ", e);
                            await FileHandler.deleteTmp(system_file_name, false);
                            return ErrorHandler.InternalServerError(res);
                        }
                    }
                }
            });
            busboy.on('finish', function() {
                res.setHeader('Connection', 'close');               // keep the connection open while streaming ??
            });
            req.pipe(busboy)
        }catch(e){
            console.log("error while writing temp file to system (while initialising busboy), ", e);
            ErrorHandler.InternalServerError(res);
        }
    }

    static get(req, res){
        return res.status(200).json({
            message: "get asset",
        });
    }

    static delete(req, res){
        return res.status(200).json({
            message: "delete asset",
        });
    }
}

module.exports = AssetController;
