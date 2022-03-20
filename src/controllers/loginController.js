const jwt=require("jsonwebtoken");
const authorModel = require("../models/authorModel");

const loginUser=async (req,res)=>{
    try{
        let username=req.body.email;
        let password=req.body.password;
        let author=await authorModel.findOne({email:username,password:password});

        if(!author){
            res.status(400).send({status:false, msg:"No author found with this email, Please check your email or password."})
        }
        else{
            let token=jwt.sign({
                userId:author._id.toString(),
                batch:"thorium",
                projectDoneBy:"Junaid",
                groupNo:"8"
            },"Secret-Key");

            res.setHeader("x-api-key",token);
            res.status(200).send({status:true,msg:token});
        }; 
    }
    catch(error){
        res.status(500).send({status:false,msg:error})
    }
}

module.exports.loginUser=loginUser;