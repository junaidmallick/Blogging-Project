const { count } = require("console")
const BlogModel = require("../models/blogModel")
const AuthorModel = require("../models/authorModel")


const createBlog = async (req, res) =>{
    try {
        let data = req.body
        let id = req.body.authorId
        // checking if data is empty
        if (Object.keys(data) == 0)
            // returning 400 {bad request data is empty}
            return res.status(400).send({ status: false, msg: "Bad request. Content to post missing" })

        let idMatch = await AuthorModel.findById(id)
        // id match in author model, if not
        if (!idMatch)
            // returning error with 404 user input does not match
            return res.status(404).send({ status: false, msg: "No such author present in the database" })

        let savedData = await BlogModel.create(data)
        //creating entry in db with status 201 success!
        return res.status(201).send({ status: true, msg: savedData })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}


const getBlogs= async (req, res) => {
    try {
        const data = req.query
        const blogs = await BlogModel.find(data,{isDeleted:false},{isPublished:true}).populate("authorId")
        if (blogs.length == 0) return res.status(404).send({ status: false, msg: "No blogs Available." })
        res.status(200).send({ status: true, count: blogs.length, data: blogs });
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}


const updateBlogs = async function (req, res) {
    try {
        //Validate: The blogId is present in request path params or not.
        let blog_Id = req.params.blogId
        if (!blog_Id) return res.status(400).send({ status: false, msg: "Blog Id is required" })

        //Validate: The blogId is valid or not.
        let blog = await BlogModel.findById(blog_Id)
        if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exists" })

        //Validate: If the blogId exists (must have isDeleted false)
        let is_Deleted = Object.keys(blog).find(isDeleted => blog[isDeleted] === true)
        if (is_Deleted == true) return res.status(404).send({ status: false, msg: "Blog is already deleted" })

        //Updates a blog by changing the its title, body, adding tags, adding a subcategory.
        let Title = req.body.title
        let Body = req.body.body
        let Tags = req.body.tags
        let Subcategory = req.body.subcategory
        let updatedBlog = await BlogModel.findOneAndUpdate({ _id: blog_Id },
            {
                $set: {
                    title: Title, body: Body, isPublished: true, subcategory: Subcategory,
                    tags: Tags, publishedAt: new Date()
                }
            }, { new: true })
        //Sending the updated response
        res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ status: false, msg: " Server Error", error: err.message })
    }
}



const deleteBlogByid= async function (req, res) {
    try {
        //Validate: The blogId is present in request path params or not.
        let blog_Id = req.params.blogId
        if (!blog_Id) return res.status(400).send({ status: false, msg: "Blog Id is required" })

        //Validate: The blogId is valid or not.
        let blog = await BlogModel.findById(blog_Id)
        if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exists" })

        //Validate: If the blogId is not deleted (must have isDeleted false)
        let is_Deleted = Object.keys(blog).find(isDeleted => blog[isDeleted] === true)
        if (is_Deleted == true) return res.status(404).send({ status: false, msg: "Blog is already deleted" })

        //Delete a blog by changing the its isDeleted to true.
        let deletedBlog = await BlogModel.findOneAndUpdate({ _id: blog_Id },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        //Sending the Deleted response after updating isDeleted : true
        res.status(200).send({ status: true, data: deletedBlog })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ status: false, msg: " Server Error", error: err.message })
    }
}

const deleteBlogByQuerCondition = async function (req, res) {
    try {
        const data = req.query
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "No input provided" })
        const deleteBYquery = await BlogModel.updateMany(data, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (!deleteBYquery) return res.status(404).send({ status: false, msg: "no such blog found" })
        res.status(200).send({ status: true, msg: deleteBYquery })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};


module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs;
module.exports.deleteBlogByid = deleteBlogByid;
module.exports.deleteBlogByQuerCondition= deleteBlogByQuerCondition;