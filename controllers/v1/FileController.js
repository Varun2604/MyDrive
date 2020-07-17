const {ErrorHandler, Utils} = require("../../helpers");
const config = require("../../config");
const {File} = require("../../repositories");

class FileController {
    static create(req, res) {
        (async()=>{
            try{
                let result = await File.Create(req.body.name, req.body.is_public, req.body.asset);
                return res.status(200).json({
                    message: "successfully created file",
                    details : result.ops[0]
                });
            }catch(e){
                if( ( e.message.indexOf('Invalid' ) === 0) || ( e.message.indexOf('Mandatory' ) === 0 ) ){
                    return ErrorHandler.BadRequest(res, e.message);
                }else{
                    console.log("Error while creating file", e);
                    return ErrorHandler.InternalServerError(res);
                }
            }
        })();
    }

    static get(req, res){
        return res.status(200).json({
            message: "get file",
        });
    }

    static getAll(req, res){
        return res.status(200).json({
            message: "get files",
        });
    }

    static update(req, res){
        return res.status(200).json({
            message: "update files",
        });
    }

    static delete(req, res){
        return res.status(200).json({
            message: "delete file",
        });
    }
}

module.exports = FileController;
