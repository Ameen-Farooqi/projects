import booksModel from "../models/booksModel.mjs";
import userModel from "../models/userModel.mjs";
import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.mjs";
import uploadImage from "../aws/uploadImage.mjs";
const createBook = async (req, res) => {
    try {
        let data = req.body;
        let files=req.files;
        if(files.length===0){
            return res.status(400).send({status:false,error:'files are required'})
        }
        const bookCover=await uploadImage(files[0]);
        if(!bookCover){
            return res.status(400).send({status:false,error:'failed to upload book cover'})
        }
        data.bookCover=bookCover;
        let { userId } = data;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, error: 'user id is not valid' })
        }
        let user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).send({ status: false, error: 'user not found' })
        }

        let book = await booksModel.create(data);
        return res.status(201).send({ status: true, data: book })
    }
    catch (error) {
        if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: false, error: error.message })
        } else if (error.message.includes('validation')) {
            return res.status(400).send({ status: false, error: error.message })
        } else {
            return res.status(500).send({ status: false, error: error.message })
        }
    }
}
const getBooks = async (req, res) => {
    try {
        let query = { isDeleted: false };
        let { userId, category, subcategory } = req.query;
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).send({ status: false, error: 'user id is not valid' })
            }
            query.userId = userId;
        }
        if (category) {
            query.category = category;
        }
        if (subcategory) {
            query.subcategory = subcategory;
        }
        let books = await booksModel.find(query).select('_id title excerpt userId category releasedAt reviews');
        if (books.length === 0) {
            return res.status(404).send({ status: false, error: 'books not found' })
        }
        return res.status(200).send({ status: true, message: 'books list', data: books })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}
const getBookById= async (req,res)=>{
    try {
        let {bookId}=req.params;
        if(!mongoose.Types.ObjectId.isValid(bookId)){
            return res.status(400).send({status:false,error:'book id is not valid'})
        }
        let book= await booksModel.findById(bookId);
        if(!book){
            return res.status(404).send({status:false,message:'book not found'})
        }
        let reviews= await reviewModel.find({bookId:bookId}).select('_id reviewedBy bookId reviewedAt rating review');
        return res.status(200).send({status:true,message:'book details',data:{...book._doc,reviewsData:reviews}})
    }
    catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}
const updateBook= async (req,res)=>{
    try {
        let {bookId}=req.params;
        let data=req.body;
        if(!mongoose.Types.ObjectId.isValid(bookId)){
            return res.status(400).send({status:false,error:'book id is not valid'})
        }
        let oldBook= await booksModel.findById(bookId);
        if(oldBook==null){
            return res.status(404).send({status:false,error:'book not found'})
        }
        let book= await booksModel.findByIdAndUpdate(bookId,{$set:data},{new:true});
        return res.status(200).send({status:true,message:'book updated successfully',data:book})
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
const deleteBook= async (req,res)=>{
    try {
        let {bookId}=req.params;
        if(!mongoose.Types.ObjectId.isValid(bookId)){
            return res.status(400).send({status:false,error:'book id is not valid'})
        }
        await booksModel.findByIdAndUpdate(bookId,{$set:{isDeleted:true,deletedAt:Date.now()}});
        return res.status(200).send({status:true,message:'book deleted successfully'})
    }
    catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}
export { createBook, getBooks,getBookById,updateBook,deleteBook };