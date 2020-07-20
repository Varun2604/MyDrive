const Busboy = require('busboy');
const { v4: uuidv4 } = require('uuid');

const {ErrorHandler, StorageHandler, JWTAuth} = require("../../helpers");
const {File, Asset, User} = require('../../services');

const PATH_FILE_ID_REGEX = /(([0-9a-z]+)(?=\/assets))(?!(\/files\/))/g;         //assuming mongo db ids are only created with numbers and small chars

class AssetController {
    create(req, res) {
        const self = this;
        try{
            //TODO check out the max_file_count/max_file_size cap feature of busboy, currently both cases are handled manually
            let busboy = new Busboy({ headers: req.headers/*, limits : { fileSize : 1024, files : 1}*/ });
            let system_file_name = uuidv4();
            let created_asset = false;
            busboy.on('file', async function(field_name, file_stream, filename, transfer_encoding, mime_type) {
                if(!created_asset){
                    created_asset = true;
                    let splits = filename.split('.');
                    system_file_name = system_file_name + "." +splits[splits.length -1];
                    try{
                        // save file to system
                        let size = await StorageHandler.SaveTmpAs(file_stream, system_file_name);
                        // create an asset entry to db.
                        let result = await Asset.Create(filename, system_file_name, 'utf8', mime_type, size, req.user);
                        //return success
                        return res.status(200).json({
                            message: "asset stored temporarily, link to a file before 7 days",
                            details : {
                                id : result.insertedId
                            }
                        });
                    }catch (e){
                        await StorageHandler.DeleteTmp(system_file_name, false);
                        if(e.message.indexOf('Unsupported content type') !== -1){
                            return ErrorHandler.InvalidValueBadRequest(res, ['file']);
                        }else if(e.code === 'ERR_FS_FILE_TOO_LARGE'){
                            return ErrorHandler.BadRequest(res, e.message);
                        }else{
                            console.error("error while writing temp file to system, ", e);
                            return ErrorHandler.InternalServerError(res);
                        }
                    }
                }
            });
            busboy.on('finish', function() {
                res.setHeader('Connection', 'close');               // keep the connection open while streaming ??
            });
            busboy.on('error', function(e){
                console.error("busboy error, ", e);
                ErrorHandler.InternalServerError(res);
            });
            req.pipe(busboy)
        }catch(e){
            console.error("error while writing temp file to system (while initialising busboy), ", e);
            ErrorHandler.InternalServerError(res);
        }
    }

    get(req, res){
        let self = this;
        (async()=>{
            try{
                let file_id = req.path.match(PATH_FILE_ID_REGEX)[0];
                let file = await File.Get(file_id);
                if(file.is_public){
                    //if file is public, serve it as it is
                    await AssetController.__serveFile(file, res);
                }else{

                    let user = await AssetController.__authenticateUser(req);
                    //return unauthorised if the file
                    if(user == null || (user.id !== file.created_by.id) ){
                        return ErrorHandler.Unauthorised(res);
                    }

                    return await AssetController.__serveFile(file, res);
                }
            }catch(e){
                if( ( e.message.indexOf('Invalid' ) === 0) || ( e.message.indexOf('Mandatory' ) === 0 ) ){
                    return ErrorHandler.BadRequest(res, e.message);
                }else if(e.code === 'ENOTFOUND'){
                    return ErrorHandler.BadRequest(res, 'Invalid file ID');
                }else{
                    console.error("Error while fetching asset", e);
                    return ErrorHandler.InternalServerError(res);
                }
            }
        })();
    }
    delete(req, res){
        return res.status(200).json({
            message: "delete asset",
        });
    }
    static __serveFile(file, res){
        return new Promise(async (resolve, reject) => {
            try{
                let file_buf = await StorageHandler.FetchApproved(file.system_file_name);
                res.set('Content-Type', file.mime_type);
                res.set('Content-Disposition', 'attachment; filename='+file.name);
                res.status(200).send(file_buf);
                resolve();
            }catch (e) {
                reject(e);
            }
        });
    }
    static __authenticateUser(req){
        return new Promise(async (resolve, reject) => {
            try {
                //if file is not public, authenticate the user before serving the file.
                let token = req.cookies.token;
                if (!token) {
                    token = req.header('Authorization');
                }
                // if the token is not set, return an unauthorized error
                if (!token) {
                    return resolve(null);
                }
                let payload  = await JWTAuth.Verify(token);
                //verify teh user with the input jwt token.
                resolve(await User.ValidateUser(payload.user_name, payload.password))
            }catch (e) {
                reject(e)
            }
        });
    }
}

module.exports = new AssetController();
