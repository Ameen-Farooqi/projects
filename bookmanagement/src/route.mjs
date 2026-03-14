import express from 'express';
import { createUser,loginUser } from './controllers/userController.mjs';
import { createBook,getBooks,getBookById,updateBook,deleteBook } from './controllers/bookController.mjs';
import { createReview,updateReview,deleteReview } from './controllers/reviewController.mjs';
import {authentication,authorisation} from './auth/authentication.mjs';
const router= express.Router();
router.get('/',(req,res)=>{
    return res.status(200).send({message:'ok'})
})
router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/books',authentication,createBook);
router.get('/books',authentication,getBooks);
router.get('/books/:bookId',authentication,getBookById);
router.put('/books/:bookId',authentication,authorisation,updateBook);
router.delete('/books/:bookId',authentication,authorisation,deleteBook);
router.post('/books/:bookId/review',authentication,createReview);
router.put('/books/:bookId/review/:reviewId',authentication,authorisation,updateReview);
router.delete('/books/:bookId/review/:reviewId',authentication,authorisation,deleteReview);
export default router;