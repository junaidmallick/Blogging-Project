const AuthorModel = require("../models/authorModel")


const createAuthor = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "BAD REQUEST NO DATA PROVIDED" })
        let savedData = await AuthorModel.create(data)
        res.status(201).send({ msg: savedData })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}


module.exports.createAuthor = createAuthor



