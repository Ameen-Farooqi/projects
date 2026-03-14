import jwt from "jsonwebtoken";
import { secretKey } from "../../config.mjs";
import mongoose from "mongoose";
import booksModel from "../models/booksModel.mjs";
const authentication= async (req,res,next)=>{
    try {
        let token=req.headers.authorization;
        if(!token){
            return res.status(401).send({status:false,error:'token is required'})
        }
        token=token.split(' ')[1];
        let decoded=jwt.verify(token,secretKey,(err,decodedToken)=>{
            if(err){
                return res.status(401).send({status:false,error:'invalid token'})
            }
            return decodedToken;
        });
        req.decoded=decoded;
        next();
    }
    catch (error) {
        return res.status(500).send({status:false,error:error.message})
    }
}
const authorisation= async (req,res,next)=>{
    try {
        let userId=req.decoded.userId;
        let bookId=req.params.bookId;
        if(!mongoose.Types.ObjectId.isValid(bookId)){
            return res.status(400).send({status:false,error:'book id is not valid'})
        }
        let book=await booksModel.findOne({_id:bookId,isDeleted:false});
        if(!book){
            return res.status(404).send({status:false,error:'book not found'})
        }
        if(userId!==book.userId.toString()){
            return res.status(403).send({status:false,error:'you are not authorized to access this resource'})
        }
        next();
    }
    catch (error) {
        return res.status(500).send({status:false,error:error.message})
    }
}
export {authentication,authorisation};