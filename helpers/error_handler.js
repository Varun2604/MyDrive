module.exports = class ErrorHandler {
    static Unauthorised(res) {
        return res.status(401).json({
            "message" : "Unauthorised"
        });
    }

    static InternalServerError(res){
        return res.status(500).json({
            "message" : "Internal Server Error"
        });
    }

    static BadRequest(res, message){
        return res.status(400).json({
            "message" : message || "bad request"
        });
    }

    static MandatoryFieldBadRequest(res, fields){
        return res.status(400).json({
            "message" : `Mandatory fields [ ${fields} ] not in input`
        });
    }

    static InvalidValueBadRequest(res, fields){
        return res.status(400).json({
            "message" : `Invalid value for fields [ ${fields} ]`
        });
    }
};
