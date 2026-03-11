import jwt from "jsonwebtoken";
import blogModel from "../models/blogModel.mjs";
import { secretKey } from "../../config.mjs";
const authentication= async (req,res,next)=>{
    try {
        let token=req.headers.authorization;
        if(!token){
            return res.status(401).send({message:"failed",error:"token is required"})
        }
        token=token.split(' ')[1];
        let decoded=jwt.verify(token,secretKey,(err,decodedToken)=>{
            if(err){
                return res.status(401).send({status:"false",message:"invalid token"})
            }
            return decodedToken;
        });
        req.decoded=decoded;
        next();
    }
    catch (error) {
        return res.status(500).send({message:"failed",error:error.message})
    }
}
const authorisation= async (req,res,next)=>{
    try {
        let authorId=req.decoded.authorId;
        let authorIdInBody=req.body&&req.body.authorId;
        if(!authorIdInBody||authorIdInBody===undefined){
            let blogId=req.params.blogId;
            let blog=await blogModel.findById(blogId);
            if(!blog){
                return res.status(404).send({status:"false",message:"blog not found"})
            }
            authorIdInBody= blog.authorId.toString();
        }
        if(authorId!==authorIdInBody){
            return res.status(403).send({status:"false",message:"you are not authorized to access this resource"})
        }
        next();
    }
    catch (error) {
        return res.status(500).send({message:"failed",error:error.message})
    }
}
export { authentication,authorisation};