class AssetController {
    static create(req, res) {
        return res.status(200).json({
            message: "create asset",
        });
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
