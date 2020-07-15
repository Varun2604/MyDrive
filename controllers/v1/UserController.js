class UserController {
    static create(req, res) {
        return res.status(200).json({
            message: "create user",
        });
    }

    static update(req, res){
        return res.status(200).json({
            message: "update user",
        });
    }

    static delete(req, res){
        return res.status(200).json({
            message: "delete user",
        });
    }

    static get(req, res){
        return res.status(200).json({
            message: "get users",
        });
    }
}

module.exports = UserController;
