class FileController {
    static create(req, res) {
        return res.status(200).json({
            message: "create file",
        });
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
