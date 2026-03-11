import authorModel from "../models/authorModel.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secretKey } from "../../config.mjs";
const createAuthor= async (req,res)=>{
    try {
        let data= req.body;
        let password=data.password;
        data.password=await bcrypt.hash(password,10);
        let author= await authorModel.create(data);
        return res.status(201).send({message:'ok',data:author})
    } catch (error) {
        if(error.message.includes('duplicate')){
            return res.status(400).send({message:"failed",error:error.message})
        }else if(error.message.includes('validation')){
            return res.status(400).send({message:"failed",error:error.message})
        }else{
            return res.status(500).send({message:"failed",error:error.message})
        }
    }
}
const loginAuthor= async (req,res)=>{
    try {
        let data=req.body;
        let {email,password}=data;
        let author= await authorModel.findOne({email});
        if(!author){
            return res.status(400).send({message:"failed",error:"author not found"})
        }
        let isPasswordCorrect=await bcrypt.compare(password,author.password);
        if(!isPasswordCorrect){
            return res.status(400).send({message:"failed",error:"password is incorrect"})
        }
        let token=jwt.sign({authorId:author._id},secretKey,{expiresIn:'24h'});
        res.setHeader('x-api-key',token);
        return res.status(200).send({status:"true",data:{token}})
    }
    catch (error) {
        return res.status(500).send({message:"failed",error:error.message})
    }
}
export {createAuthor,loginAuthor};