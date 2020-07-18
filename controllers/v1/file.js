const {ErrorHandler, Utils} = require("../../helpers");
const config = require("../../config");
const {File} = require("../../services");

class FileController {
    create(req, res) {
        (async()=>{
            try{
                let result = await File.Create(req.body.name, req.body.is_public, req.body.asset, req.user);
                let f = result.ops[0];
                delete f.system_file_name;
                return res.status(200).json({
                    message: "successfully created file",
                    details : f
                });
            }catch(e){
                if( ( e.message.indexOf('Invalid' ) === 0) || ( e.message.indexOf('Mandatory' ) === 0 ) ){
                    return ErrorHandler.BadRequest(res, e.message);
                }else{
                    console.error("Error while creating file", e);
                    return ErrorHandler.InternalServerError(res);
                }
            }
        })();
    }

    get(req, res){
        (async()=>{
            try{
                let result = await File.Get(req.body.id);
                delete result.system_file_name;
                return res.status(200).json({
                    message: "successfully fetched file",
                    details : result
                });
            }catch(e){
                if( ( e.message.indexOf('Invalid' ) === 0) || ( e.message.indexOf('Mandatory' ) === 0 ) ){
                    return ErrorHandler.BadRequest(res, e.message);
                }else{
                    console.error("Error while fetching file", e);
                    return ErrorHandler.InternalServerError(res);
                }
            }
        })();
    }

    getAll(req, res){
        return res.status(200).json({
            message: "get files",
        });
    }

    update(req, res){
        return res.status(200).json({
            message: "update files",
        });
    }

    delete(req, res){
        return res.status(200).json({
            message: "delete file",
        });
    }
}

module.exports = new FileController();
