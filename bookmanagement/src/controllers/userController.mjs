import userModel from "../models/userModel.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secretKey } from "../../config.mjs";
const createUser= async (req,res)=>{
    try {
        let data= req.body;
        let password=data.password;
        if(!password){
            return res.status(400).send({message:'failed',error:'password is required'})
        }
        if(password.length<8 || password.length>15){
            return res.status(400).send({message:'failed',error:'password must be between 8 and 15 characters'})
        }
        data.password=await bcrypt.hash(password,10);
        let user= await userModel.create(data);
        return res.status(201).send({status:true,data:user})
    }
    catch (error) {
        if(error.message.includes('duplicate')){
            return res.status(400).send({message:'failed',error:error.message})
        }else if(error.message.includes('validation')){
            return res.status(400).send({message:'failed',error:error.message})
        }else{
            return res.status(500).send({message:'failed',error:error.message})
        }
    }
}
const loginUser= async (req,res)=>{
    try {
        let data= req.body;
        let {email,password}=data;
        let user= await userModel.findOne({email});
        if(!user){
            return res.status(400).send({status:false,error:'user not found'})
        }
        let isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).send({status:false,error:'password is incorrect'})
        }
        let token=jwt.sign({userId:user._id},secretKey,{expiresIn:'24h'});
        res.setHeader('x-api-key',token);
        return res.status(200).send({status:true,data:{token}})
    }
    catch (error) {
        return res.status(500).send({status:false,error:error.message})
    }
}
export {createUser,loginUser};