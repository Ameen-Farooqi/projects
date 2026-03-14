import reviewModel from "../models/reviewModel.mjs";
import mongoose from "mongoose";
import booksModel from "../models/booksModel.mjs";
const createReview= async (req,res)=>{
    try {
        let {bookId}=req.params;
        let data=req.body;
        if(!mongoose.Types.ObjectId.isValid(bookId)){
            return res.status(400).send({status:false,error:'book id is not valid'})
        }
        let book= await booksModel.findOne({_id:bookId,isDeleted:false});
        if(!book){
            return res.status(404).send({status:false,error:'book not found'})
        }
        let review= await reviewModel.create(data);
        let updatedBook= await booksModel.findByIdAndUpdate(bookId,{$inc:{reviews:1}},{new:true});
        return res.status(201).send({status:true,message:'review added successfully',data:{...review._doc,book:updatedBook._doc}});
    }
    catch (error) {
        if(error.message.includes('duplicate')){
            return res.status(400).send({status:false,error:error.message})
        }else if(error.message.includes('validation')){
            return res.status(400).send({status:false,error:error.message})
        }else{
            return res.status(500).send({status:false,error:error.message})
        }
    }
}
const updateReview= async (req,res)=>{
    try {
        let {bookId,reviewId}=req.params;
        let data=req.body;
        if(!mongoose.Types.ObjectId.isValid(bookId)){
            return res.status(400).send({status:false,error:'book id is not valid'})
        }
        if(!mongoose.Types.ObjectId.isValid(reviewId)){
            return res.status(400).send({status:false,error:'review id is not valid'})
        }
        let book= await booksModel.findOne({_id:bookId,isDeleted:false});
        if(!book){
            return res.status(404).send({status:false,error:'book not found'})
        }
        let review= await reviewModel.findOne({_id:reviewId,bookId:bookId,isDeleted:false});
        if(!review){
            return res.status(404).send({status:false,error:'review not found'})
        }
        let updatedReview= await reviewModel.findByIdAndUpdate(reviewId,{$set:data},{new:true});
        return res.status(200).send({status:true,message:'review updated successfully',data:{...updatedReview._doc,book:book._doc}});
    }
    catch (error) {
        if(error.message.includes('duplicate')){
            return res.status(400).send({status:false,error:error.message})
        }else if(error.message.includes('validation')){
            return res.status(400).send({status:false,error:error.message})
        }else{
            return res.status(500).send({status:false,error:error.message})
        }
    }
}
const deleteReview= async (req,res)=>{
    try {
        let {bookId,reviewId}=req.params;
        if(!mongoose.Types.ObjectId.isValid(bookId)){
            return res.status(400).send({status:false,error:'book id is not valid'})
        }
        if(!mongoose.Types.ObjectId.isValid(reviewId)){
            return res.status(400).send({status:false,error:'review id is not valid'})
        }
        let book= await booksModel.findOne({_id:bookId,isDeleted:false});
        if(!book){
            return res.status(404).send({status:false,error:'book not found'})
        }
        let review= await reviewModel.findOne({_id:reviewId,bookId:bookId,isDeleted:false});
        if(!review){
            return res.status(404).send({status:false,error:'review not found'})
        }
        await reviewModel.findByIdAndDelete(reviewId);
        await booksModel.findByIdAndUpdate(bookId,{$inc:{reviews:-1}});
        return res.status(200).send({status:true,message:'review deleted successfully'});
    }
    catch (error) {
        if(error.message.includes('duplicate')){
            return res.status(400).send({status:false,error:error.message})
        }else if(error.message.includes('validation')){
            return res.status(400).send({status:false,error:error.message})
        }else{
            return res.status(500).send({status:false,error:error.message})
        }
    }
}
export {createReview,updateReview,deleteReview};