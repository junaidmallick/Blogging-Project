const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel")

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-Api-Key"];
        if (!token) token = req.headers["x-api-key"];

        if (!token) return res.status(404).send({ status: false, msg: "token must be present." });
        let decodedToken = jwt.verify(token, "Secret-Key");
        //   console.log(decodedToken);
        if (!decodedToken)
            return res.status(404).send({ status: false, msg: "token is invalid." });
        next();
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}


const authorisation = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        let decodedtoken = jwt.verify(token, "Secret-Key")

        let toBeupdatedblogId = req.params.blogId
        if (toBeupdatedblogId) {
            let updatingAuthorId = await blogModel.find({ _id: toBeupdatedblogId }).select({ authorId: 1, _id: 0 })
            let authorId = updatingAuthorId.map(x => x.authorId)
            console.log(authorId)
            let id = decodedtoken.userId
            if (id != authorId) return res.status(403).send({ status: false, msg: "You are not authorised to perform this task" })
        }
        else {
            let AuthorId = req.query.authorId
            toBeupdatedblogId = AuthorId
            let id = decodedtoken.userId
            if (id != AuthorId) return res.status(403).send({ status: false, msg: "You are not authorised to perform this task" })
        }
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

module.exports.authentication = authentication;
module.exports.authorisation = authorisation;